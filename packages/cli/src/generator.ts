import {getTypes, ParamTransform, processQueryAST, processQueryString, QueryAST} from "@pgtyped/query";
import {pascalCase} from "pascal-case";

import {debug} from "./util";
import {ProcessingMode} from "./index";

export enum FieldType {
  String = "string",
  Number = "number",
  Bool = "boolean",
  Date = "Date",
}

const typeMap: {
  [pgTypeName: string]: string;
} = {
  // Integer types
  int2: FieldType.Number,
  int4: FieldType.Number,
  int8: FieldType.Number,
  smallint: FieldType.Number,
  int: FieldType.Number,
  bigint: FieldType.Number,

  // Precision types
  real: FieldType.Number,
  float4: FieldType.Number,
  float: FieldType.Number,
  float8: FieldType.Number,
  numeric: FieldType.Number,
  decimal: FieldType.Number,

  // Serial types
  smallserial: FieldType.Number,
  serial: FieldType.Number,
  bigserial: FieldType.Number,

  // Common string types
  uuid: FieldType.String,
  text: FieldType.String,
  varchar: FieldType.String,
  char: FieldType.String,

  // Bool types
  bit: FieldType.Bool, // TODO: better bit array support
  bool: FieldType.Bool,
  boolean: FieldType.Bool,

  // Extra types
  date: FieldType.Date,
  money: FieldType.Number,
};

export interface IField {
  fieldName: string;
  fieldType: string;
}

const interfaceGen = (interfaceName: string, contents: string) =>
  `export interface ${interfaceName} {
${contents}
}\n\n`;

export const generateInterface = (
  interfaceName: string,
  fields: IField[],
) => {
  const contents = fields
    .map(({
      fieldName, fieldType,
    }) => `  ${fieldName}: ${fieldType};`)
    .join("\n");
  return interfaceGen(interfaceName, contents);
};

export const generateTypeAlias = (
  typeName: string,
  alias: string,
) => `export type ${typeName} = ${alias};\n\n`;

type ParsedQuery = {
  name: string;
  body: string;
  mode: ProcessingMode.TS,
} | {
  ast: QueryAST,
  mode: ProcessingMode.SQL,
}

export async function queryToTypeDeclarations(
  parsedQuery: ParsedQuery,
  connection: any,
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

  if ("errorCode" in typeData) {
    // tslint:disable-next-line:no-console
    console.error("Error in query. Details: %o", typeData);
    const returnInterface = generateTypeAlias(`I${interfaceName}Result`, "never");
    const paramInterface = generateTypeAlias(`I${interfaceName}Params`, "never");
    const resultErrorComment = `/** Query '${queryName}' is invalid, so its result is assigned type 'never' */\n`;
    const paramErrorComment = `/** Query '${queryName}' is invalid, so its parameters are assigned type 'never' */\n`;
    return `${resultErrorComment}${returnInterface}${paramErrorComment}${paramInterface}`;
  }

  const {
    returnTypes,
    paramMetadata,
  } = typeData;

  const returnFieldTypes: IField[] = [];
  const paramFieldTypes: IField[] = [];

  returnTypes.forEach(({ returnName, typeName, nullable }) => {
    if (!(typeName in typeMap)) {
      debug(`field type ${typeName} not found`);
      return;
    }
    let tsTypeName = typeMap[typeName];
    if (nullable) {
      tsTypeName += " | null";
    }

    returnFieldTypes.push({
      fieldName: returnName,
      fieldType: tsTypeName,
    });
  });

  const { params } = paramMetadata;
  for (const param of paramMetadata.mapping) {
    if (
      param.type === ParamTransform.Scalar || param.type === ParamTransform.Spread
    ) {
      const isArray = param.type === ParamTransform.Spread;
      const pgTypeName = params[param.assignedIndex - 1];
      if (!(pgTypeName in typeMap)) {
        throw new Error(`field type ${pgTypeName} not found`);
      }
      let tsTypeName = typeMap[pgTypeName];
      tsTypeName += " | null";

      paramFieldTypes.push({
        fieldName: param.name,
        fieldType: isArray ? `Array<${tsTypeName}>` : tsTypeName,
      });
    } else {
      const isArray = param.type === ParamTransform.PickSpread;
      let fieldType = Object.values(param.dict)
        .map(p => `    ${p.name}: ${typeMap[params[p.assignedIndex - 1]]}`)
        .join(",\n");
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

  const resultInterfaceName = `I${interfaceName}Result`;
  const returnTypesInterface =
    `/** '${queryName}' return type */\n` + (
      returnFieldTypes.length > 0
        ? generateInterface(
          `I${interfaceName}Result`,
          returnFieldTypes,
        )
        : generateTypeAlias(resultInterfaceName, "void")
    );

  const paramInterfaceName = `I${interfaceName}Params`;
  const paramTypesInterface =
    `/** '${queryName}' parameters type */\n` + (
      paramFieldTypes.length > 0
        ? generateInterface(
          `I${interfaceName}Params`,
          paramFieldTypes,
        )
        : generateTypeAlias(paramInterfaceName, "void")
    );

  const typePairInterface =
    `/** '${queryName}' query type */\n` + generateInterface(
    `I${interfaceName}Query`,
    [
      {fieldName: "params", fieldType: paramInterfaceName},
      {fieldName: "result", fieldType: resultInterfaceName},
    ]);

  const interfaces = `${paramTypesInterface}${returnTypesInterface}${typePairInterface}`;

  return interfaces;
}
