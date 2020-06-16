import {
  getTypes,
  ParamTransform,
  parseSQLFile,
  parseTypeScriptFile,
  prettyPrintEvents,
  processQueryAST,
  processQueryString,
  QueryAST,
} from '@pgtyped/query';
import { camelCase } from 'camel-case';
import { pascalCase } from 'pascal-case';
import { ProcessingMode } from './index';
import { DefaultTypeMapping, TypeAllocator } from './types';
import { ParsedConfig } from './config';

export interface IField {
  fieldName: string;
  fieldType: string;
}

const interfaceGen = (interfaceName: string, contents: string) =>
  `export interface ${interfaceName} {
${contents}
}\n\n`;

export const generateInterface = (interfaceName: string, fields: IField[]) => {
  const contents = fields
    .map(({ fieldName, fieldType }) => `  ${fieldName}: ${fieldType};`)
    .join('\n');
  return interfaceGen(interfaceName, contents);
};

export const generateTypeAlias = (typeName: string, alias: string) =>
  `export type ${typeName} = ${alias};\n\n`;

type ParsedQuery =
  | {
      name: string;
      body: string;
      mode: ProcessingMode.TS;
    }
  | {
      ast: QueryAST;
      mode: ProcessingMode.SQL;
    };

export async function queryToTypeDeclarations(
  parsedQuery: ParsedQuery,
  connection: any,
  types: TypeAllocator,
  config: ParsedConfig,
): Promise<string> {
  let queryData;
  let queryName;
  if (parsedQuery.mode === ProcessingMode.TS) {
    queryName = parsedQuery.name;
    queryData = processQueryString(parsedQuery.body);
  } else {
    queryName = parsedQuery.ast.name;
    queryData = processQueryAST(parsedQuery.ast);
  }

  const typeData = await getTypes(queryData, queryName, connection);
  const interfaceName = pascalCase(queryName);

  if ('errorCode' in typeData) {
    // tslint:disable-next-line:no-console
    console.error('Error in query. Details: %o', typeData);
    const returnInterface = generateTypeAlias(
      `I${interfaceName}Result`,
      'never',
    );
    const paramInterface = generateTypeAlias(
      `I${interfaceName}Params`,
      'never',
    );
    const resultErrorComment = `/** Query '${queryName}' is invalid, so its result is assigned type 'never' */\n`;
    const paramErrorComment = `/** Query '${queryName}' is invalid, so its parameters are assigned type 'never' */\n`;
    return `${resultErrorComment}${returnInterface}${paramErrorComment}${paramInterface}`;
  }

  const { returnTypes, paramMetadata } = typeData;

  const returnFieldTypes: IField[] = [];
  const paramFieldTypes: IField[] = [];

  returnTypes.forEach(({ returnName, type, nullable }) => {
    let tsTypeName = types.use(type);
    if (nullable) {
      tsTypeName += ' | null';
    }

    returnFieldTypes.push({
      fieldName: config.camelCaseColumnNames
        ? camelCase(returnName)
        : returnName,
      fieldType: tsTypeName,
    });
  });

  const { params } = paramMetadata;
  for (const param of paramMetadata.mapping) {
    if (
      param.type === ParamTransform.Scalar ||
      param.type === ParamTransform.Spread
    ) {
      const isArray = param.type === ParamTransform.Spread;
      const pgTypeName = params[param.assignedIndex - 1];
      let tsTypeName = types.use(pgTypeName);
      tsTypeName += ' | null | void';

      paramFieldTypes.push({
        fieldName: param.name,
        fieldType: isArray ? `Array<${tsTypeName}>` : tsTypeName,
      });
    } else {
      const isArray = param.type === ParamTransform.PickSpread;
      let fieldType = Object.values(param.dict)
        .map((p) => `    ${p.name}: ${types.use(params[p.assignedIndex - 1])}`)
        .join(',\n');
      fieldType = `{\n${fieldType}\n  }`;
      if (isArray) {
        fieldType = `Array<${fieldType}>`;
      }
      paramFieldTypes.push({
        fieldName: param.name,
        fieldType,
      });
    }
  }

  // TypeAllocator errors are currently considered non-fatal since a `never`
  // type is emitted which can be caught later when compiling the generated
  // code
  // tslint:disable-next-line:no-console
  types.errors.forEach((err) => console.log(err));

  const resultInterfaceName = `I${interfaceName}Result`;
  const returnTypesInterface =
    `/** '${queryName}' return type */\n` +
    (returnFieldTypes.length > 0
      ? generateInterface(`I${interfaceName}Result`, returnFieldTypes)
      : generateTypeAlias(resultInterfaceName, 'void'));

  const paramInterfaceName = `I${interfaceName}Params`;
  const paramTypesInterface =
    `/** '${queryName}' parameters type */\n` +
    (paramFieldTypes.length > 0
      ? generateInterface(`I${interfaceName}Params`, paramFieldTypes)
      : generateTypeAlias(paramInterfaceName, 'void'));

  const typePairInterface =
    `/** '${queryName}' query type */\n` +
    generateInterface(`I${interfaceName}Query`, [
      { fieldName: 'params', fieldType: paramInterfaceName },
      { fieldName: 'result', fieldType: resultInterfaceName },
    ]);

  return [paramTypesInterface, returnTypesInterface, typePairInterface].join(
    '',
  );
}

interface ITypedQuery {
  fileName: string;
  query?: {
    name: string;
    ast: QueryAST;
    paramTypeAlias: string;
    returnTypeAlias: string;
  };
  typeDeclaration: string;
}

async function generateTypedecsFromFile(
  contents: string,
  fileName: string,
  connection: any,
  mode: 'ts' | 'sql',
  types: TypeAllocator = new TypeAllocator(DefaultTypeMapping),
  config: ParsedConfig,
): Promise<ITypedQuery[]> {
  const results: ITypedQuery[] = [];
  if (mode === 'ts') {
    const queries = parseTypeScriptFile(contents, fileName);
    for (const query of queries) {
      const result = await queryToTypeDeclarations(
        {
          body: query.tagContent,
          name: query.queryName,
          mode: ProcessingMode.TS,
        },
        connection,
        types,
        config,
      );
      const typedQuery = {
        fileName,
        queryName: query.queryName,
        typeDeclaration: result,
      };
      results.push(typedQuery);
    }
  } else {
    const {
      parseTree: { queries },
      events,
    } = parseSQLFile(contents, fileName);
    if (events.length > 0) {
      prettyPrintEvents(contents, events);
      if (events.find((e) => 'critical' in e)) {
        return results;
      }
    }
    for (const query of queries) {
      const result = await queryToTypeDeclarations(
        { ast: query, mode: ProcessingMode.SQL },
        connection,
        types,
        config,
      );
      const typedQuery = {
        query: {
          name: camelCase(query.name),
          ast: query,
          paramTypeAlias: `I${pascalCase(query.name)}Params`,
          returnTypeAlias: `I${pascalCase(query.name)}Result`,
        },
        fileName,
        queryName: query.name,
        typeDeclaration: result,
      };
      results.push(typedQuery);
    }
  }
  return results;
}

export async function generateDeclarationFile(
  contents: string,
  fileName: string,
  connection: any,
  mode: 'ts' | 'sql',
  types: TypeAllocator = new TypeAllocator(DefaultTypeMapping),
  config: ParsedConfig,
): Promise<{ typeDecs: ITypedQuery[]; declarationFileContents: string }> {
  if (mode === 'sql') {
    types.use({ name: 'PreparedQuery', from: '@pgtyped/query' });
  }
  const typeDecs = await generateTypedecsFromFile(
    contents,
    fileName,
    connection,
    mode,
    types,
    config,
  );
  let declarationFileContents = '';
  declarationFileContents += `/** Types generated for queries found in "${fileName}" */\n`;
  declarationFileContents += types.declaration();
  declarationFileContents += '\n';
  for (const typeDec of typeDecs) {
    declarationFileContents += typeDec.typeDeclaration;
    if (!typeDec.query) {
      continue;
    }
    const queryPP = typeDec.query.ast.statement.body
      .split('\n')
      .map((s: string) => ' * ' + s)
      .join('\n');
    declarationFileContents += `const ${
      typeDec.query.name
    }IR: any = ${JSON.stringify(typeDec.query.ast)};\n\n`;
    declarationFileContents +=
      `/**\n` +
      ` * Query generated from SQL:\n` +
      ` * \`\`\`\n` +
      `${queryPP}\n` +
      ` * \`\`\`\n` +
      ` */\n`;
    declarationFileContents +=
      `export const ${typeDec.query.name} = ` +
      `new PreparedQuery<${typeDec.query.paramTypeAlias},${typeDec.query.returnTypeAlias}>` +
      `(${typeDec.query.name}IR);\n\n\n`;
  }
  return { declarationFileContents, typeDecs };
}
