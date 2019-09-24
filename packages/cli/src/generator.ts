import {
  AsyncQueue,
  startup,
  getTypes,
} from '@pg-typed/query';
import pascalCase from 'pascal-case';

import { debug } from './util';

export enum FieldType {
  String = 'string',
  Number = 'number'
}

const typeMap = {
  uuid: FieldType.String,
  int4: FieldType.Number,
  text: FieldType.String,
};

export interface IField {
  fieldName: string;
  fieldType: FieldType;
  nullable: boolean;
}

export const reindent = (
  str: string,
  level: number,
) => str.replace(
  /^\s*/gm,
  '  '.repeat(level)
);

const interfaceGen = (interfaceName: string, contents: string) =>
  `export interface ${interfaceName} {
${reindent(contents, 1)}
}\n\n`;

export const generateInterface = (
  interfaceName: string,
  fields: Array<IField>,
) => {
  const contents = fields
    .map(({
      fieldName, fieldType, nullable,
    }) => `${fieldName}: ${fieldType}${nullable ? ' | null' : ''};`)
    .join('\n');
  return interfaceGen(interfaceName, contents);
};

export const generateTypeAlias = (
  typeName: string,
  alias: string,
) => `export type ${typeName} = ${alias};\n\n`;

export async function queryToTypeDeclarations(
  query: { name: string, body: string },
  connection: any,
) {
  const typeData = await getTypes(query.body, query.name, connection);
  const interfaceName = pascalCase(query.name);

  if ('errorCode' in typeData) {
    debug('Error in query. Details: %o', typeData);
    const returnInterface = generateTypeAlias(`I${interfaceName}Result`, 'never');
    const paramInterface = generateTypeAlias(`I${interfaceName}Params`, 'never');
    const resultErrorComment = `/** Query '${query.name}' is invalid, so its result is assigned type 'never' */\n`;
    const paramErrorComment = `/** Query '${query.name}' is invalid, so its parameters are assigned type 'never' */\n`;
    return `${resultErrorComment}${returnInterface}${paramErrorComment}${paramInterface}`;
  }

  const {
    returnTypes,
    paramTypes,
  } = typeData;

  const returnFieldTypes: Array<IField> = [];
  const paramFieldTypes: Array<IField> = [];

  returnTypes.forEach(({ returnName, typeName, nullable }) => {
    if (!(typeName in typeMap)) {
      debug(`field type ${typeName} not found`);
      return;
    }
    returnFieldTypes.push({
      fieldName: returnName,
      fieldType: typeMap[typeName as keyof typeof typeMap],
      nullable,
    });
  })

  Object
    .entries(paramTypes)
    .forEach(([paramName, typeName]) => {
      if (!(typeName in typeMap)) {
        debug(`field type ${typeName} not found`);
        return;
      }
      paramFieldTypes.push({
        fieldName: paramName,
        fieldType: typeMap[typeName as keyof typeof typeMap],
        nullable: true,
      });
    })

  const returnTypesInterface =
    `/** '${query.name}' return type */\n` + (
      returnFieldTypes.length > 0
        ? generateInterface(
          `I${interfaceName}Result`,
          returnFieldTypes,
        )
        : generateTypeAlias(`I${interfaceName}Result`, 'void')
    );

  const paramTypesInterface =
    `/** '${query.name}' parameters type */\n` + (
      paramFieldTypes.length > 0
        ? generateInterface(
          `I${interfaceName}Params`,
          paramFieldTypes,
        )
        : generateTypeAlias(`I${interfaceName}Params`, 'void')
    );

  const interfaces = `${paramTypesInterface}${returnTypesInterface}`;

  return interfaces;
}
