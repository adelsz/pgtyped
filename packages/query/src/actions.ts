import debugBase from 'debug';
import crypto from 'crypto';

import { AsyncQueue, messages, PreparedObjectType } from '@pgtyped/wire';

import { IInterpolatedQuery, QueryParam } from './preprocessor';

const debugQuery = debugBase('client:query');

export const generateHash = (
  username: string,
  password: string,
  salt: Buffer,
) => {
  const hash = (str: string) =>
    crypto.createHash('md5').update(str).digest('hex');
  const shadow = hash(password + username);
  const result = crypto.createHash('md5');
  result.update(shadow);
  result.update(salt);
  return 'md5' + result.digest('hex');
};

export async function startup(
  options: {
    host: string;
    password?: string;
    port: number;
    user: string;
    dbName: string;
  },
  queue: AsyncQueue,
) {
  try {
    await queue.connect(options);
    const startupParams = {
      user: options.user,
      database: options.dbName,
      client_encoding: "'utf-8'",
    };
    await queue.send(messages.startupMessage, { params: startupParams });
    const result = await queue.reply(
      messages.readyForQuery,
      messages.authenticationCleartextPassword,
      messages.authenticationMD5Password,
    );
    if ('trxStatus' in result) {
      // No auth required
      return;
    }
    if (!options.password) {
      throw new Error('password required for MD5 hash auth');
    }
    let password = options.password;
    if ('salt' in result) {
      // if MD5 auth scheme
      password = generateHash(options.user, password, result.salt);
    }
    await queue.send(messages.passwordMessage, { password });
    await queue.reply(messages.authenticationOk);
    await queue.reply(messages.readyForQuery);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(`Connection failed: ${e.message}`);
    process.exit(1);
  }
}

export async function runQuery(query: string, queue: AsyncQueue) {
  const resultRows = [];
  await queue.send(messages.query, { query });
  debugQuery('sent query %o', query);
  {
    const result = await queue.reply(messages.rowDescription);
    debugQuery(
      'received row description: %o',
      result.fields.map((c) => c.name.toString()),
    );
  }
  {
    while (true) {
      const result = await queue.reply(
        messages.dataRow,
        messages.commandComplete,
      );
      if ('commandTag' in result) {
        break;
      }
      const row = result.columns.map((c) => c.value.toString());
      resultRows.push(row);
      debugQuery('received row data: %o', row);
    }
  }
  return resultRows;
}

export interface IQueryTypes {
  paramMetadata: {
    mapping: QueryParam[];
    params: string[];
  };
  returnTypes: Array<{
    returnName: string;
    columnName: string;
    typeName: string;
    nullable: boolean;
  }>;
}

export interface IParseError {
  errorCode: string;
  hint?: string;
  message: string;
  position?: string;
}

type TypeData =
  | {
      fields: Array<{
        name: string;
        tableOID: number;
        columnAttrNumber: number;
        typeOID: number;
        typeSize: number;
        typeModifier: number;
        formatCode: number;
      }>;
      params: Array<{ oid: number }>;
    }
  | IParseError;

/**
 * Returns the raw query type data as returned by the Describe message
 * @param query query string, can only contain proper Postgres numeric placeholders
 * @param query name, should be unique per query body
 * @param queue
 */
export async function getTypeData(
  query: string,
  name: string,
  queue: AsyncQueue,
): Promise<TypeData> {
  // Send all the messages needed and then flush
  await queue.send(messages.parse, {
    name,
    query,
    dataTypes: [],
  });
  await queue.send(messages.describe, {
    name,
    type: PreparedObjectType.Statement,
  });
  await queue.send(messages.close, {
    target: PreparedObjectType.Statement,
    targetName: name,
  });
  await queue.send(messages.flush, {});

  const parseResult = await queue.reply(
    messages.errorResponse,
    messages.parseComplete,
  );

  // Recover server state from any errors
  await queue.send(messages.sync, {});

  if ('fields' in parseResult) {
    // Error case
    const { fields: errorFields } = parseResult;
    return {
      errorCode: errorFields.R,
      hint: errorFields.H,
      message: errorFields.M,
      position: errorFields.P,
    };
  }
  const paramsResult = await queue.reply(
    messages.parameterDescription,
    messages.noData,
  );
  const params = 'params' in paramsResult ? paramsResult.params : [];
  const fieldsResult = await queue.reply(
    messages.rowDescription,
    messages.noData,
  );
  const fields = 'fields' in fieldsResult ? fieldsResult.fields : [];
  await queue.reply(messages.closeComplete);
  return { params, fields };
}

export async function getTypes(
  queryData: IInterpolatedQuery,
  name: string,
  queue: AsyncQueue,
): Promise<IQueryTypes | IParseError> {
  const typeData = await getTypeData(queryData.query, name, queue);
  if ('errorCode' in typeData) {
    return typeData;
  }

  const { params, fields } = typeData;

  const paramTypeOIDs = params.map((p) => p.oid);
  const returnTypesOIDs = fields.map((f) => f.typeOID);
  const usedTypesOIDs = paramTypeOIDs.concat(returnTypesOIDs);

  const typeRows = await runQuery(
    `select oid, typname from pg_type where oid in (${usedTypesOIDs.join(
      ',',
    )})`,
    queue,
  );
  const typeMap: { [oid: number]: string } = typeRows.reduce(
    (acc, [oid, typeName]) => ({ ...acc, [oid]: typeName }),
    {},
  );

  const attrMatcher = ({
    tableOID,
    columnAttrNumber,
  }: {
    tableOID: number;
    columnAttrNumber: number;
  }) => `(attrelid = ${tableOID} and attnum = ${columnAttrNumber})`;

  const attrSelection =
    fields.length > 0 ? fields.map(attrMatcher).join(' or ') : false;

  const attributeRows = await runQuery(
    `select
      (attrelid || ':' || attnum) as attid, attname, attnotnull
     from pg_attribute where ${attrSelection};`,
    queue,
  );
  const attrMap: {
    [attid: string]: {
      columnName: string;
      nullable: boolean;
    };
  } = attributeRows.reduce(
    (acc, [attid, attname, attnotnull]) => ({
      ...acc,
      [attid]: {
        columnName: attname,
        nullable: attnotnull !== 't',
      },
    }),
    {},
  );

  const returnTypes = fields.map((f) => ({
    ...attrMap[`${f.tableOID}:${f.columnAttrNumber}`],
    returnName: f.name,
    typeName: typeMap[f.typeOID],
  }));

  const paramMetadata = {
    params: params.map(({ oid }) => typeMap[oid]),
    mapping: queryData.mapping,
  };

  return { paramMetadata, returnTypes };
}
