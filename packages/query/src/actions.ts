import { AsyncQueue, messages, PreparedObjectType } from '@pgtyped/wire';
import { cString } from '@pgtyped/wire/lib/helpers';
import crypto from 'crypto';
import tls from 'tls';
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
    ssl?: tls.ConnectionOptions | boolean;
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
      messages.authenticationSASL,
    );
    if ('trxStatus' in result) {
      // No auth required
      return;
    }
    if (!options.password) {
      throw new Error('password required for hash auth');
    }
    let password = options.password;
    if ('SASLMechanisms' in result) {
      // https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/sasl.js
      // https://github.com/ecotilly/DataAnalytics/blob/27d5def10d49bcc46833c6b07dd428ac816fd21c/et-gcp-firebase/functions/node_modules%20copy/pg/lib/connection.js
      // https://www.2ndquadrant.com/en/blog/password-authentication-methods-in-postgresql/
      // https://www.postgresql.org/docs/current/protocol-message-formats.html
      if (result.SASLMechanisms?.indexOf('SCRAM-SHA-256') === -1) {
        throw new Error('SASL: Only mechanism SCRAM-SHA-256 is currently supported')
      }

      const clientNonce = crypto.randomBytes(18).toString('base64')
      const response = 'n,,n=*,r=' + clientNonce;
      await queue.send(messages.SASLInitialResponse, {
        mechanism: 'SCRAM-SHA-256',
        responseLength: Buffer.byteLength(response),
        response,
      });

      const SASLContinueResult = await queue.reply(messages.AuthenticationSASLContinue);

      const serverVariables = extractVariablesFromFirstServerMessage(SASLContinueResult.SASLdata);
      if (!serverVariables.nonce.startsWith(clientNonce)) {
        throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce')
      }

      const passwordBytes = cString(password)

      const saltBytes = Buffer.from(serverVariables.salt, 'base64')
      const saltedPassword = Hi(passwordBytes, saltBytes, serverVariables.iteration)

      const clientKey = createHMAC(saltedPassword, 'Client Key')
      const storedKey = crypto.createHash('sha256').update(clientKey).digest()

      const clientFirstMessageBare = 'n=*,r=' + clientNonce
      const serverFirstMessage = 'r=' + serverVariables.nonce + ',s=' + serverVariables.salt + ',i=' + serverVariables.iteration

      const clientFinalMessageWithoutProof = 'c=biws,r=' + serverVariables.nonce

      const authMessage = clientFirstMessageBare + ',' + serverFirstMessage + ',' + clientFinalMessageWithoutProof

      const clientSignature = createHMAC(storedKey, authMessage)
      const clientProofBytes = xorBuffers(clientKey, clientSignature)
      const clientProof = clientProofBytes.toString('base64')

      const serverKey = createHMAC(saltedPassword, 'Server Key')
      const serverSignatureBytes = createHMAC(serverKey, authMessage)

      const calculatedServerSignature = serverSignatureBytes.toString('base64')


      // then client sends a SASLResponse
      await queue.send(messages.SASLResponse, {
        response: clientFinalMessageWithoutProof + ',p=' + clientProof,
      })

      // then server sends AuthenticationSASLFinal

      const AuthenticationSASLFinalResult = await queue.reply(messages.AuthenticationSASLFinal);
      const { serverSignatureFromServer } = parseServerFinalMessage(AuthenticationSASLFinalResult.SASLdata.slice(0, -1))

      if (calculatedServerSignature !== serverSignatureFromServer) {
        throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match')
      }

      // TODO add a queue.reply method that parses several messages in the final received buffer:
      // AuthenticationSASLFinal
      // ParameterStatus (several times)
      // BackendKeyData
      // ReadyForQuery

    } else if ('salt' in result) {
      password = generateHash(options.user, password, result.salt);
      await queue.send(messages.passwordMessage, { password });
      await queue.reply(messages.authenticationOk);
      await queue.reply(messages.readyForQuery);
    }
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

function isBase64(text: string) {
  return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(text)
}

function parseAttributePairs(text: string) {
  if (typeof text !== 'string') {
    throw new TypeError('SASL: attribute pairs text must be a string')
  }

  return new Map(
    text.split(',').filter(attrValue => /^.=./.test(attrValue)).map((attrValue) => {
      const name = attrValue[0]
      const value = attrValue.substring(2)
      return [name, value]
    })
  )
}

function parseServerFinalMessage(serverData: string) {
  const attrPairs = parseAttributePairs(serverData)
  const serverSignatureFromServer = attrPairs.get('v')
  if (!serverSignatureFromServer) {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing')
  } else if (!isBase64(serverSignatureFromServer)) {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64')
  }
  return {
    serverSignatureFromServer,
  }
}

function extractVariablesFromFirstServerMessage (data: string): {nonce: string; salt: string; iteration: number} {
  let nonce, salt, iteration

  String(data).split(',').forEach(function (part) {
    switch (part[0]) {
      case 'r':
        nonce = part.substr(2)
        break
      case 's':
        salt = part.substr(2)
        break
      case 'i':
        iteration = parseInt(part.substr(2), 10)
        break
    }
  })

  if (!nonce) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing')
  }

  if (!salt) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing')
  }

  if (!iteration) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing')
  }

  return {
    nonce,
    salt,
    iteration
  }
}

function xorBuffers (a: Buffer, b: Buffer): Buffer {
  if (!Buffer.isBuffer(a)) a = Buffer.from(a)
  if (!Buffer.isBuffer(b)) b = Buffer.from(b)
  var res = []
  if (a.length > b.length) {
    for (let i = 0; i < b.length; i++) {
      res.push(a[i] ^ b[i])
    }
  } else {
    for (let j = 0; j < a.length; j++) {
      res.push(a[j] ^ b[j])
    }
  }
  return Buffer.from(res)
}

function createHMAC (key: NodeJS.ArrayBufferView, msg: string | NodeJS.ArrayBufferView) {
  return crypto.createHmac('sha256', key).update(msg).digest()
}

function Hi (password: NodeJS.ArrayBufferView, saltBytes: Buffer, iterations: number) {
  let ui1 = createHMAC(password, Buffer.concat([saltBytes, Buffer.from([0, 0, 0, 1])]))
  let ui = ui1
  for (let i = 0; i < iterations - 1; i++) {
    ui1 = createHMAC(password, ui1)
    ui = xorBuffers(ui, ui1)
  }

  return ui
}
