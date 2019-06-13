import debugBase from 'debug';

import {
  AsyncQueue,
  messages,
  PreparedObjectType,
} from '@pg-typed/wire';

const debugQuery = debugBase('client:query');

export async function startup(options: {
  user: string,
  database: string,
}, queue: AsyncQueue) {
  await queue.connect();
  const startupParams = {
    ...options,
    client_encoding: '\'utf-8\'',
  };
  await queue.send(messages.startupMessage, { params: startupParams });
  await queue.reply(messages.readyForQuery);
}

export async function runQuery(query: string, queue: AsyncQueue) {
  const resultRows = [];
  await queue.send(messages.query, { query });
  debugQuery('sent query %o', query);
  {
    const result = await queue.reply(messages.rowDescription);
    debugQuery('received row description: %o', result.fields.map(c => c.name.toString()));
  }
  {
    while (true) {
      const result = await queue.reply(messages.dataRow, messages.commandComplete);
      if ('commandTag' in result) {
        break;
      }
      const row = result.columns.map(c => c.value.toString());
      resultRows.push(row);
      debugQuery('received row data: %o', row);
    }
  }
  return resultRows;
}

interface TQueryTypes {
  paramTypes: { [paramName: string]: string },
  returnTypes: Array<{
    returnName: string,
    columnName: string,
    typeName: string,
    nullable: boolean,
  }>,
};

/**
 * Replaces all named parameters with numbered ones.
 * E.g. all parameters of the form `:paramName` are transformed into form `$k`, where k > 0
 * @param query query string
 * @returns returns desugared query string and an array of all parameter names found
 */
export function desugarQuery(query: string) {
  const placeholderRegex = /:(\w*)/g;
  const paramNames: Array<any> = [];
  const desugaredQuery = query.replace(placeholderRegex, (_, paramName) => {
    paramNames.push(paramName);
    const replacement = `$${paramNames.length}`;
    return replacement;
  })
  return {
    desugaredQuery,
    paramNames,
  };
}

/**
 * Returns the raw query type data as returned by the Describe message
 * @param query query string, can only contain proper Postgres numeric placeholders
 * @param queue 
 */
export async function getTypeData(
  query: string,
  queue: AsyncQueue,
) {
  // Send all the messages needed and then flush
  await queue.send(messages.parse, {
    name: 'basic_select',
    query,
    dataTypes: [],
  });
  await queue.send(messages.describe, {
    name: 'basic_select',
    type: PreparedObjectType.Statement,
  });
  await queue.send(messages.close, {
    target: PreparedObjectType.Statement,
    targetName: 'basic_select',
  });
  await queue.send(messages.flush, {});

  await queue.reply(messages.parseComplete);
  const { params } = await queue.reply(messages.parameterDescription);
  const { fields } = await queue.reply(messages.rowDescription);
  await queue.reply(messages.closeComplete);
  return { params, fields };
}

export async function getTypes(query: string, queue: AsyncQueue): Promise<TQueryTypes> {
  const {
    desugaredQuery,
    paramNames,
  } = desugarQuery(query);

  const {
    params,
    fields,
  } = await getTypeData(desugaredQuery, queue);

  const paramTypeOIDs = params.map(p => p.oid);
  const returnTypesOIDs = fields.map(f => f.typeOID);
  const usedTypesOIDs = paramTypeOIDs.concat(returnTypesOIDs);

  const typeRows = await runQuery(
    `select oid, typname from pg_type where oid in (${usedTypesOIDs.join(',')})`,
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
    tableOID: number,
    columnAttrNumber: number,
  }) => `(attrelid = ${tableOID} and attnum = ${columnAttrNumber})`;

  const attrSelection = fields.map(attrMatcher).join(' or ');

  const attributeRows = await runQuery(
    `select
      (attrelid || ':' || attnum) as attid, attname, attnotnull
     from pg_attribute where ${attrSelection};`,
    queue,
  );
  const attrMap: { [attid: string]: {
    columnName: string,
    nullable: boolean,
  } } = attributeRows.reduce(
    (
      acc,
      [attid, attname, attnotnull]
    ) => ({
      ...acc,
      [attid]: {
        columnName: attname,
        nullable: attnotnull !== 't'
      },
    }),
    {},
  );

  const returnTypes = fields.map(f => ({
    ...attrMap[`${f.tableOID}:${f.columnAttrNumber}`],
    returnName: f.name,
    typeName: typeMap[f.typeOID],
  }));

  const paramTypes: { [paramName: string]: string } = {};
  params.forEach((param, index) => {
    const paramName = paramNames[index];
    const paramType = typeMap[param.oid];
    paramTypes[paramName] = paramType;
  });
  return { paramTypes, returnTypes };
}