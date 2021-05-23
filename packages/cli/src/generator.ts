import {
  getTypes,
  ParamTransform,
  parseSQLFile,
  parseTypeScriptFile,
  prettyPrintEvents,
  processTSQueryAST,
  processSQLQueryAST,
  SQLQueryAST,
  TSQueryAST,
} from '@pgtyped/query';
import { camelCase } from 'camel-case';
import { pascalCase } from 'pascal-case';
import { ProcessingMode } from './index';
import { DefaultTypeMapping, TypeAllocator } from './types';
import { ParsedConfig } from './config';
import path from 'path';

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
      ast: TSQueryAST;
      mode: ProcessingMode.TS;
    }
  | {
      ast: SQLQueryAST;
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
    queryName = pascalCase(parsedQuery.ast.name);
    queryData = processTSQueryAST(parsedQuery.ast);
  } else {
    queryName = pascalCase(parsedQuery.ast.name);
    queryData = processSQLQueryAST(parsedQuery.ast);
  }

  const typeData = await getTypes(queryData, connection);
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
    if (nullable || nullable == null) {
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
      const assignedIndex =
        param.assignedIndex instanceof Array
          ? param.assignedIndex[0]
          : param.assignedIndex;
      const pgTypeName = params[assignedIndex - 1];
      let tsTypeName = types.use(pgTypeName);

      if (!param.required) {
        tsTypeName += ' | null | void';
      }

      paramFieldTypes.push({
        fieldName: param.name,
        fieldType: isArray ? `readonly (${tsTypeName})[]` : tsTypeName,
      });
    } else {
      const isArray = param.type === ParamTransform.PickSpread;
      let fieldType = Object.values(param.dict)
        .map((p) => {
          const paramType = types.use(params[p.assignedIndex - 1]);
          return p.required
            ? `    ${p.name}: ${paramType}`
            : `    ${p.name}: ${paramType} | null | void`;
        })
        .join(',\n');
      fieldType = `{\n${fieldType}\n  }`;
      if (isArray) {
        fieldType = `readonly (${fieldType})[]`;
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

type ITypedQuery =
  | {
      mode: 'ts';
      fileName: string;
      query: {
        name: string;
        ast: TSQueryAST;
      };
      typeDeclaration: string;
    }
  | {
      mode: 'sql';
      fileName: string;
      query: {
        name: string;
        ast: SQLQueryAST;
        paramTypeAlias: string;
        returnTypeAlias: string;
      };
      typeDeclaration: string;
    };

async function generateTypedecsFromFile(
  contents: string,
  fileName: string,
  connection: any,
  mode: 'ts' | 'sql',
  types: TypeAllocator = new TypeAllocator(DefaultTypeMapping),
  config: ParsedConfig,
): Promise<ITypedQuery[]> {
  const results: ITypedQuery[] = [];

  const { queries, events } =
    mode === 'ts'
      ? parseTypeScriptFile(contents, fileName)
      : parseSQLFile(contents);
  if (events.length > 0) {
    prettyPrintEvents(contents, events);
    if (events.find((e) => 'critical' in e)) {
      return results;
    }
  }
  for (const queryAST of queries) {
    let typedQuery: ITypedQuery;
    if (mode === 'sql') {
      const sqlQueryAST = queryAST as SQLQueryAST;
      const result = await queryToTypeDeclarations(
        { ast: sqlQueryAST, mode: ProcessingMode.SQL },
        connection,
        types,
        config,
      );
      typedQuery = {
        mode: 'sql' as const,
        query: {
          name: camelCase(sqlQueryAST.name),
          ast: sqlQueryAST,
          paramTypeAlias: `I${pascalCase(sqlQueryAST.name)}Params`,
          returnTypeAlias: `I${pascalCase(sqlQueryAST.name)}Result`,
        },
        fileName,
        typeDeclaration: result,
      };
    } else {
      const tsQueryAST = queryAST as TSQueryAST;
      const result = await queryToTypeDeclarations(
        {
          ast: tsQueryAST,
          mode: ProcessingMode.TS,
        },
        connection,
        types,
        config,
      );
      typedQuery = {
        mode: 'ts' as const,
        fileName,
        query: {
          name: tsQueryAST.name,
          ast: tsQueryAST,
        },
        typeDeclaration: result,
      };
    }
    results.push(typedQuery);
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

  // file paths in generated files must be stable across platforms
  // https://github.com/adelsz/pgtyped/issues/230
  const isWindowsPath = path.sep === '\\';
  // always emit POSIX paths
  const stableFilePath = isWindowsPath
    ? fileName.replace(/\\/g, '/')
    : fileName;

  let declarationFileContents = '';
  declarationFileContents += `/** Types generated for queries found in "${stableFilePath}" */\n`;
  declarationFileContents += types.declaration();
  declarationFileContents += '\n';
  for (const typeDec of typeDecs) {
    declarationFileContents += typeDec.typeDeclaration;
    if (typeDec.mode === 'ts') {
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
