import {
  parseSQLFile,
  prettyPrintEvents,
  queryASTToIR,
  SQLQueryAST,
  SQLQueryIR,
  TSQueryAST,
} from '@pgtyped/parser';

import { getTypes, TypeSource } from '@pgtyped/query';
import {
  ParameterTransform,
  processSQLQueryIR,
  processTSQueryAST,
} from '@pgtyped/runtime';
import { camelCase } from 'camel-case';
import { pascalCase } from 'pascal-case';
import path from 'path';
import { ParsedConfig, TransformConfig } from './config.js';
import { parseCode as parseTypescriptFile } from './parseTypescript.js';
import { TypeAllocator, TypeDefinitions, TypeScope } from './types.js';
import { IQueryTypes } from '@pgtyped/query/lib/actions.js';

export enum ProcessingMode {
  SQL = 'sql-file',
  TS = 'query-file',
}

export interface IField {
  optional?: boolean;
  fieldName: string;
  fieldType: string;
  comment?: string;
}

const interfaceGen = (interfaceName: string, contents: string) =>
  `export interface ${interfaceName} {
${contents}
}\n\n`;

export function escapeComment(comment: string) {
  return comment.replace(/\*\//g, '*\\/');
}

/** Escape a key if it isn't an identifier literal */
export function escapeKey(key: string) {
  if (/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(key)) {
    return key;
  }
  return `"${key}"`;
}

export const generateInterface = (interfaceName: string, fields: IField[]) => {
  const sortedFields = fields
    .slice()
    .sort((a, b) => a.fieldName.localeCompare(b.fieldName));
  const contents = sortedFields
    .map(({ fieldName, fieldType, comment, optional }) => {
      const lines = [];
      if (comment) {
        lines.push(`  /** ${escapeComment(comment)} */`);
      }
      const keySuffix = optional ? '?' : '';
      const entryLine = `  ${escapeKey(fieldName)}${keySuffix}: ${fieldType};`;
      lines.push(entryLine);
      return lines.join('\n');
    })
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
  typeSource: TypeSource,
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
    queryData = processSQLQueryIR(queryASTToIR(parsedQuery.ast));
  }

  const typeData = await typeSource(queryData);
  const interfaceName = pascalCase(queryName);
  const interfacePrefix = config.hungarianNotation ? 'I' : '';

  const typeError = 'errorCode' in typeData;
  const hasAnonymousColumns =
    !typeError &&
    (typeData as IQueryTypes).returnTypes.some(
      ({ returnName }) => returnName === '?column?',
    );

  if (typeError || hasAnonymousColumns) {
    // tslint:disable:no-console
    if (typeError) {
      console.error('Error in query. Details: %o', typeData);
      if (config.failOnError) {
        throw new Error(
          `Query "${queryName}" is invalid. Can't generate types.`,
        );
      }
    } else {
      console.error(
        `Query '${queryName}' is invalid. Query contains an anonymous column. Consider giving the column an explicit name.`,
      );
    }
    let explanation = '';
    if (hasAnonymousColumns) {
      explanation = `Query contains an anonymous column. Consider giving the column an explicit name.`;
    }

    const returnInterface = generateTypeAlias(
      `${interfacePrefix}${interfaceName}Result`,
      'never',
    );
    const paramInterface = generateTypeAlias(
      `${interfacePrefix}${interfaceName}Params`,
      'never',
    );
    const resultErrorComment = `/** Query '${queryName}' is invalid, so its result is assigned type 'never'.\n * ${explanation} */\n`;
    const paramErrorComment = `/** Query '${queryName}' is invalid, so its parameters are assigned type 'never'.\n * ${explanation} */\n`;
    return `${resultErrorComment}${returnInterface}${paramErrorComment}${paramInterface}`;
  }

  const { returnTypes, paramMetadata } = typeData;

  const returnFieldTypes: IField[] = [];
  const paramFieldTypes: IField[] = [];

  returnTypes.forEach(({ returnName, type, nullable, comment }) => {
    let tsTypeName = types.use(type, TypeScope.Return);

    const lastCharacter = returnName[returnName.length - 1]; // Checking for type hints
    const addNullability = lastCharacter === '?';
    const removeNullability = lastCharacter === '!';
    if (
      (addNullability || nullable || nullable == null) &&
      !removeNullability
    ) {
      tsTypeName += ' | null';
    }

    if (addNullability || removeNullability) {
      returnName = returnName.slice(0, -1);
    }

    returnFieldTypes.push({
      fieldName: config.camelCaseColumnNames
        ? camelCase(returnName)
        : returnName,
      fieldType: tsTypeName,
      comment,
    });
  });

  const { params } = paramMetadata;
  for (const param of paramMetadata.mapping) {
    if (
      param.type === ParameterTransform.Scalar ||
      param.type === ParameterTransform.Spread
    ) {
      const isArray = param.type === ParameterTransform.Spread;
      const assignedIndex =
        param.assignedIndex instanceof Array
          ? param.assignedIndex[0]
          : param.assignedIndex;
      const pgTypeName = params[assignedIndex - 1];
      let tsTypeName = types.use(pgTypeName, TypeScope.Parameter);

      if (!param.required) {
        tsTypeName += ' | null | void';
      }

      // Allow optional scalar parameters to be missing from parameters object
      const optional =
        param.type === ParameterTransform.Scalar && !param.required;

      paramFieldTypes.push({
        optional,
        fieldName: param.name,
        fieldType: isArray ? `readonly (${tsTypeName})[]` : tsTypeName,
      });
    } else {
      const isArray = param.type === ParameterTransform.PickSpread;
      let fieldType = Object.values(param.dict)
        .map((p) => {
          const paramType = types.use(
            params[p.assignedIndex - 1],
            TypeScope.Parameter,
          );
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

  const resultInterfaceName = `${interfacePrefix}${interfaceName}Result`;
  const returnTypesInterface =
    `/** '${queryName}' return type */\n` +
    (returnFieldTypes.length > 0
      ? generateInterface(
          `${interfacePrefix}${interfaceName}Result`,
          returnFieldTypes,
        )
      : generateTypeAlias(resultInterfaceName, 'void'));

  const paramInterfaceName = `${interfacePrefix}${interfaceName}Params`;
  const paramTypesInterface =
    `/** '${queryName}' parameters type */\n` +
    (paramFieldTypes.length > 0
      ? generateInterface(
          `${interfacePrefix}${interfaceName}Params`,
          paramFieldTypes,
        )
      : generateTypeAlias(paramInterfaceName, 'void'));

  const typePairInterface =
    `/** '${queryName}' query type */\n` +
    generateInterface(`${interfacePrefix}${interfaceName}Query`, [
      { fieldName: 'params', fieldType: paramInterfaceName },
      { fieldName: 'result', fieldType: resultInterfaceName },
    ]);

  return [paramTypesInterface, returnTypesInterface, typePairInterface].join(
    '',
  );
}

export type TSTypedQuery = {
  mode: 'ts';
  fileName: string;
  query: {
    name: string;
    ast: TSQueryAST;
    queryTypeAlias: string;
  };
  typeDeclaration: string;
};

type SQLTypedQuery = {
  mode: 'sql';
  fileName: string;
  query: {
    name: string;
    ast: SQLQueryAST;
    ir: SQLQueryIR;
    paramTypeAlias: string;
    returnTypeAlias: string;
  };
  typeDeclaration: string;
};

export type TypedQuery = TSTypedQuery | SQLTypedQuery;
export type TypeDeclarationSet = {
  typedQueries: TypedQuery[];
  typeDefinitions: TypeDefinitions;
  fileName: string;
};
export async function generateTypedecsFromFile(
  contents: string,
  fileName: string,
  connection: any,
  transform: TransformConfig,
  types: TypeAllocator,
  config: ParsedConfig,
): Promise<TypeDeclarationSet> {
  const typedQueries: TypedQuery[] = [];
  const interfacePrefix = config.hungarianNotation ? 'I' : '';
  const typeSource: TypeSource = (query) => getTypes(query, connection);

  const { queries, events } =
    transform.mode === 'sql'
      ? parseSQLFile(contents)
      : parseTypescriptFile(contents, fileName, transform);

  if (events.length > 0) {
    prettyPrintEvents(contents, events);
    if (events.find((e) => 'critical' in e)) {
      return {
        typedQueries,
        typeDefinitions: types.toTypeDefinitions(),
        fileName,
      };
    }
  }

  for (const queryAST of queries) {
    let typedQuery: TypedQuery;
    if (transform.mode === 'sql') {
      const sqlQueryAST = queryAST as SQLQueryAST;
      const result = await queryToTypeDeclarations(
        { ast: sqlQueryAST, mode: ProcessingMode.SQL },
        typeSource,
        types,
        config,
      );
      typedQuery = {
        mode: 'sql' as const,
        query: {
          name: camelCase(sqlQueryAST.name),
          ast: sqlQueryAST,
          ir: queryASTToIR(sqlQueryAST),
          paramTypeAlias: `${interfacePrefix}${pascalCase(
            sqlQueryAST.name,
          )}Params`,
          returnTypeAlias: `${interfacePrefix}${pascalCase(
            sqlQueryAST.name,
          )}Result`,
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
        typeSource,
        types,
        config,
      );
      typedQuery = {
        mode: 'ts' as const,
        fileName,
        query: {
          name: tsQueryAST.name,
          ast: tsQueryAST,
          queryTypeAlias: `${interfacePrefix}${pascalCase(
            tsQueryAST.name,
          )}Query`,
        },
        typeDeclaration: result,
      };
    }
    typedQueries.push(typedQuery);
  }
  return { typedQueries, typeDefinitions: types.toTypeDefinitions(), fileName };
}

export function generateDeclarations(typeDecs: TypedQuery[]): string {
  let typeDeclarations = '';
  for (const typeDec of typeDecs) {
    typeDeclarations += typeDec.typeDeclaration;
    if (typeDec.mode === 'ts') {
      continue;
    }
    const queryPP = typeDec.query.ast.statement.body
      .split('\n')
      .map((s: string) => ' * ' + s)
      .join('\n');
    typeDeclarations += `const ${typeDec.query.name}IR: any = ${JSON.stringify(
      typeDec.query.ir,
    )};\n\n`;
    typeDeclarations +=
      `/**\n` +
      ` * Query generated from SQL:\n` +
      ` * \`\`\`\n` +
      `${queryPP}\n` +
      ` * \`\`\`\n` +
      ` */\n`;
    typeDeclarations +=
      `export const ${typeDec.query.name} = ` +
      `new PreparedQuery<${typeDec.query.paramTypeAlias},${typeDec.query.returnTypeAlias}>` +
      `(${JSON.stringify(typeDec.query.name)},${typeDec.query.name}IR);\n\n\n`;
  }
  return typeDeclarations;
}

export function generateDeclarationFile(typeDecSet: TypeDeclarationSet) {
  // file paths in generated files must be stable across platforms
  // https://github.com/adelsz/pgtyped/issues/230
  const isWindowsPath = path.sep === '\\';
  // always emit POSIX paths
  const stableFilePath = isWindowsPath
    ? typeDecSet.fileName.replace(/\\/g, '/')
    : typeDecSet.fileName;

  let content = `/** Types generated for queries found in "${stableFilePath}" */\n`;
  content += TypeAllocator.typeDefinitionDeclarations(
    typeDecSet.fileName,
    typeDecSet.typeDefinitions,
  );
  content += '\n';
  content += generateDeclarations(typeDecSet.typedQueries);
  return content;
}

export function genTypedSQLOverloadFunctions(
  functionName: string,
  typedQueries: TSTypedQuery[],
) {
  return typedQueries
    .map(
      (typeDec) =>
        `export function ${functionName}(s: \`${typeDec.query.ast.text}\`): ReturnType<typeof sourceSql<${typeDec.query.queryTypeAlias}>>;`,
    )
    .filter((s) => s)
    .join('\n');
}
