import { AsyncQueue, messages, PreparedObjectType } from '@pgtyped/wire';
import crypto from 'crypto';
import debugBase from 'debug';

import { IInterpolatedQuery, QueryParam } from './preprocessor';
import { DatabaseTypeKind, isEnum, MappableType } from './type';

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
    params: MappableType[];
  };
  returnTypes: Array<{
    returnName: string;
    columnName: string;
    type: MappableType;
    nullable?: boolean;
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
  const uniqueName = crypto.createHash('md5').update(query).digest('hex');
  // Send all the messages needed and then flush
  await queue.send(messages.parse, {
    name: uniqueName,
    query,
    dataTypes: [],
  });
  await queue.send(messages.describe, {
    name: uniqueName,
    type: PreparedObjectType.Statement,
  });
  await queue.send(messages.close, {
    target: PreparedObjectType.Statement,
    targetName: uniqueName,
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

interface TypeRow {
  oid: string;
  typeName: string;
  typeKind: string;
  enumLabel: string;
}

// Aggregate rows from database types catalog into MappableTypes
export function reduceTypeRows(
  typeRows: TypeRow[],
): Record<string, MappableType> {
  return typeRows.reduce((typeMap, { oid, typeName, typeKind, enumLabel }) => {
    // Attempt to merge any partially defined types
    const typ = typeMap[oid] ?? typeName;

    if (typeKind === DatabaseTypeKind.Enum && enumLabel) {
      // We should get one row per enum value
      return {
        ...typeMap,
        [oid]: {
          name: typeName,
          // Merge enum values
          enumValues: [...(isEnum(typ) ? typ.enumValues : []), enumLabel],
        },
      };
    }

    return { ...typeMap, [oid]: typ };
  }, {} as Record<string, MappableType>);
}

// TODO: self-host
async function runTypesCatalogQuery(
  typeOIDs: number[],
  queue: AsyncQueue,
): Promise<TypeRow[]> {
  let rows: any[];
  if (typeOIDs.length > 0) {
    rows = await runQuery(
      `
SELECT pt.oid, pt.typname, pt.typtype, pe.enumlabel
FROM pg_type pt
LEFT JOIN pg_enum pe ON pt.oid = pe.enumtypid
WHERE pt.oid IN (${typeOIDs.join(',')});
`,
      queue,
    );
  } else {
    rows = [];
  }
  return rows.map(([oid, typeName, typeKind, enumLabel]) => ({
    oid,
    typeName,
    typeKind,
    enumLabel,
  }));
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
  const typeRows = await runTypesCatalogQuery(usedTypesOIDs, queue);
  const typeMap = reduceTypeRows(typeRows);

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
    `SELECT
      (attrelid || ':' || attnum) AS attid, attname, attnotnull
     FROM pg_attribute WHERE ${attrSelection};`,
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
    type: typeMap[f.typeOID],
  }));

  const paramMetadata = {
    params: params.map(({ oid }) => typeMap[oid]),
    mapping: queryData.mapping,
  };

  return { paramMetadata, returnTypes };
}
