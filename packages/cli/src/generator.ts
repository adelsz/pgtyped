import {
  AsyncQueue,
  getTypes,
  ParamType,
  startup,
} from "@pg-typed/query";
import pascalCase from "pascal-case";

import { debug } from "./util";

export enum FieldType {
  String = "string",
  Number = "number",
}

const typeMap: {
  [pgTypeName: string]: string;
} = {
  uuid: FieldType.String,
  int4: FieldType.Number,
  text: FieldType.String,
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

export async function queryToTypeDeclarations(
  query: { name: string, body: string },
  connection: any,
): Promise<string> {
  const typeData = await getTypes(query.body, query.name, connection);
  const interfaceName = pascalCase(query.name);

  if ("errorCode" in typeData) {
    debug("Error in query. Details: %o", typeData);
    const returnInterface = generateTypeAlias(`I${interfaceName}Result`, "never");
    const paramInterface = generateTypeAlias(`I${interfaceName}Params`, "never");
    const resultErrorComment = `/** Query '${query.name}' is invalid, so its result is assigned type 'never' */\n`;
    const paramErrorComment = `/** Query '${query.name}' is invalid, so its parameters are assigned type 'never' */\n`;
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
      param.type === ParamType.Scalar || param.type === ParamType.ScalarArray
    ) {
      const isArray = param.type === ParamType.ScalarArray;
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
      const isArray = param.type === ParamType.DictArray;
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

  const returnTypesInterface =
    `/** '${query.name}' return type */\n` + (
      returnFieldTypes.length > 0
        ? generateInterface(
          `I${interfaceName}Result`,
          returnFieldTypes,
        )
        : generateTypeAlias(`I${interfaceName}Result`, "void")
    );

  const paramTypesInterface =
    `/** '${query.name}' parameters type */\n` + (
      paramFieldTypes.length > 0
        ? generateInterface(
          `I${interfaceName}Params`,
          paramFieldTypes,
        )
        : generateTypeAlias(`I${interfaceName}Params`, "void")
    );

  const interfaces = `${paramTypesInterface}${returnTypesInterface}`;

  return interfaces;
}
