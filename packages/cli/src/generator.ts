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
import { camelCase, camelCaseTransformMerge } from 'camel-case';
import { pascalCase } from 'pascal-case';
import path from 'path';
import { ParsedConfig, TransformConfig } from './config.js';
import { parseCode as parseTypescriptFile } from './parseTypescript.js';
import { TypeAllocator, TypeDefinitions, TypeScope } from './types.js';
import { IQueryTypes } from '@pgtyped/query/lib/actions.js';
import ts from 'typescript';
import {
  formatLineInfo,
  parseTsPgPromise,
  TSQueryASTWithTypeInfo,
} from './parseTsPgPromise.js';

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

const generateTupleType = (typeName: string, fields: IField[]) => {
  const contents = fields.map(({ fieldType }) => fieldType).join(', ');
  return generateTypeAlias(typeName, `[${contents}]`);
};

type ParsedQuery =
  | {
      ast: TSQueryAST | TSQueryASTWithTypeInfo;
      mode: ProcessingMode.TS;
    }
  | {
      ast: SQLQueryAST;
      mode: ProcessingMode.SQL;
    };

export enum TypePairGeneration {
  Include,
  Skip,
}

function hasTypeInfo(
  ast: TSQueryAST | TSQueryASTWithTypeInfo,
): ast is TSQueryASTWithTypeInfo {
  return (ast as TSQueryASTWithTypeInfo).type !== undefined;
}

export function generatedQueryToString(
  query: GeneratedQuery,
  config: ParsedConfig,
  typePairGeneration: TypePairGeneration,
) {
  const { queryName, paramFieldTypes, returnFieldTypes, tupleParams } = query;
  const interfacePrefix = config.hungarianNotation ? 'I' : '';
  const interfaceName = interfacePrefix + pascalCase(queryName);
  const resultInterfaceName = `${interfaceName}Result`;
  const alias = query.errorComment ? 'unknown' : 'void';
  const returnTypesInterface =
    (query.errorComment ?? getInterfaceComment(queryName, 'return', config)) +
    (returnFieldTypes.length > 0
      ? generateInterface(`${interfaceName}Result`, returnFieldTypes)
      : generateTypeAlias(resultInterfaceName, alias));

  const paramInterfaceName = `${interfaceName}Params`;
  const paramTypesInterface =
    (query.errorComment ??
      getInterfaceComment(queryName, 'parameters', config)) +
    (paramFieldTypes.length > 0
      ? tupleParams
        ? generateTupleType(paramInterfaceName, paramFieldTypes)
        : generateInterface(paramInterfaceName, paramFieldTypes)
      : typePairGeneration === TypePairGeneration.Skip && !query.errorComment
      ? ''
      : generateTypeAlias(paramInterfaceName, alias));

  const typePairInterface =
    typePairGeneration === TypePairGeneration.Skip
      ? ''
      : getInterfaceComment(queryName, 'query', config) +
        generateInterface(`${interfaceName}Query`, [
          { fieldName: 'params', fieldType: paramInterfaceName },
          { fieldName: 'result', fieldType: resultInterfaceName },
        ]);

  return [paramTypesInterface, returnTypesInterface, typePairInterface].join(
    '',
  );
}

export async function queryToTypeDeclarations(
  fileName: string,
  parsedQuery: ParsedQuery,
  typeSource: TypeSource,
  types: TypeAllocator,
  config: ParsedConfig,
): Promise<GeneratedQuery> {
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

  const typeError = 'errorCode' in typeData;
  const hasAnonymousColumns =
    !typeError &&
    (typeData as IQueryTypes).returnTypes.some(
      ({ returnName }) => returnName === '?column?',
    );

  let lineInfo = '';
  if (parsedQuery.mode === ProcessingMode.TS && hasTypeInfo(parsedQuery.ast)) {
    lineInfo =
      formatLineInfo(fileName, {
        line: parsedQuery.ast.pos.line,
        character: parsedQuery.ast.pos.character,
      }) + ': ';
  }

  if (typeError || hasAnonymousColumns) {
    // tslint:disable:no-console
    if (typeError) {
      console.error(`${lineInfo}Error in query. Details: %o`, typeData);
      if (config.failOnError) {
        throw new Error(
          `${lineInfo}Query "${queryName}" is invalid. Can't generate types.`,
        );
      }
    } else if (config.anonymousColumnWarning) {
      console.error(
        `${lineInfo}Query '${queryName}' is invalid. Query contains an anonymous column. Consider giving the column an explicit name.`,
      );
    }
    let explanation = '';
    if (hasAnonymousColumns) {
      explanation = `Query contains an anonymous column. Consider giving the column an explicit name.`;
    }

    const resultErrorComment = `/** Query '${queryName}' is invalid, so its result and parameters are assigned type 'unknown'.\n * ${explanation} */\n`;
    return {
      queryName,
      paramFieldTypes: [],
      returnFieldTypes: [],
      errorComment: resultErrorComment,
      tupleParams: false,
    };
  }

  const { returnTypes, paramMetadata } = typeData;

  const returnFieldTypes: IField[] = [];
  const paramFieldTypes: IField[] = [];

  const enumConfig = config.enums?.style === 'enum' ? config.enums : undefined;

  returnTypes.forEach(({ returnName, type, nullable, comment }) => {
    let tsTypeName = types.use(type, TypeScope.Return, enumConfig);

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
        ? camelCase(returnName, { transform: camelCaseTransformMerge })
        : returnName,
      fieldType: tsTypeName,
      comment,
    });
  });

  let tupleParams = false;
  const { params } = paramMetadata;
  for (const param of paramMetadata.mapping) {
    tupleParams = tupleParams || param.name.match(/^[0-9]+$/) !== null;
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
      let tsTypeName = types.use(
        pgTypeName,
        TypeScope.Parameter,
        config.enums?.style === 'enum' ? config.enums : undefined,
      );

      if (!param.required) {
        tsTypeName += ' | null | void';
      }
      if (param.nullable) {
        tsTypeName += ' | null';
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
            enumConfig,
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

  // TypeAllocator errors are currently considered non-fatal since an `unknown`
  // type is emitted which can be caught later when compiling the generated
  // code
  // tslint:disable-next-line:no-console
  types.errors.forEach((err) => console.log(`${lineInfo}${err.message}`));
  return {
    queryName,
    paramFieldTypes,
    returnFieldTypes,
    tupleParams,
    errorComment: null,
  };
}

export interface GeneratedQuery {
  queryName: string;
  paramFieldTypes: IField[];
  tupleParams: boolean;
  returnFieldTypes: IField[];
  errorComment: string | null;
}

const getInterfaceComment = (
  name: string,
  kind: string,
  config: ParsedConfig,
) => (config.interfaceComments ? `/** '${name}' ${kind} type */\n` : '');

export type TSTypedQuery<AstType extends TSQueryASTWithTypeInfo | TSQueryAST> =
  {
    mode: 'ts';
    fileName: string;
    query: {
      name: string;
      ast: AstType;
      queryTypeAlias: string;
    };
    typeDeclaration: GeneratedQuery;
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
  typeDeclaration: GeneratedQuery;
};

export type TypedQuery =
  | TSTypedQuery<TSQueryAST>
  | TSTypedQuery<TSQueryASTWithTypeInfo>
  | SQLTypedQuery;
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
  tsProgramGetter: (() => ts.Program) | undefined,
): Promise<TypeDeclarationSet> {
  const typedQueries: TypedQuery[] = [];
  const interfacePrefix = config.hungarianNotation ? 'I' : '';
  const typeSource: TypeSource = (query) =>
    getTypes(query, connection, config.db.schema);

  const { queries, events } =
    transform.mode === 'sql'
      ? parseSQLFile(contents)
      : transform.mode === 'ts' || transform.mode === 'ts-implicit'
      ? parseTypescriptFile(contents, fileName, transform)
      : parseTsPgPromise(fileName, contents, transform, tsProgramGetter!);

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
        fileName,
        {
          ast: sqlQueryAST,
          mode: ProcessingMode.SQL,
        },
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
      const tsQueryAST = queryAST as TSQueryASTWithTypeInfo;
      const result = await queryToTypeDeclarations(
        fileName,
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

export function generateDeclarations(
  typeDecs: TypedQuery[],
  config: ParsedConfig,
  typePairGeneration: TypePairGeneration,
): string {
  let typeDeclarations = '';
  for (const typeDec of typeDecs) {
    typeDeclarations += generatedQueryToString(
      typeDec.typeDeclaration,
      config,
      typePairGeneration,
    );
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
      `(${typeDec.query.name}IR);\n\n\n`;
  }
  return typeDeclarations;
}

export function generateDeclarationFile(
  typeDecSet: TypeDeclarationSet,
  config: ParsedConfig,
) {
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
    undefined,
  );
  content += '\n';
  content += generateDeclarations(
    typeDecSet.typedQueries,
    config,
    TypePairGeneration.Include,
  );
  return content;
}

export function genTypedSQLOverloadFunctions(
  functionName: string,
  typedQueries: TSTypedQuery<TSQueryAST>[],
) {
  return typedQueries
    .map(
      (typeDec) =>
        `export function ${functionName}(s: \`${typeDec.query.ast.text}\`): ReturnType<typeof sourceSql<${typeDec.query.queryTypeAlias}>>;`,
    )
    .filter((s) => s)
    .join('\n');
}
