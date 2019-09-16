import {
  AsyncQueue,
  startup,
  getTypes,
} from '@pg-typed/query';
import pascalCase from 'pascal-case';

import { debug } from './index';

export enum FieldType {
  String = 'string',
  Number = 'number'
}

const typeMap = {
  uuid: FieldType.String,
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
}`;

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

export async function queryToInterface(
  query: { name: string, body: string },
  connection: any,
) {
  const {
    returnTypes,
    paramTypes,
  } = await getTypes(query.body, query.name, connection);

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

  let returnTypesInterface = '';
  let paramTypesInterface = '';
  const interfaceName = pascalCase(query.name);

  if (returnFieldTypes.length > 0) {
    returnTypesInterface = generateInterface(
      `I${interfaceName}Result`,
      returnFieldTypes
    );
  }

  if (paramFieldTypes.length > 0) {
    paramTypesInterface = generateInterface(
      `I${interfaceName}Params`,
      paramFieldTypes
    );
  }

  const interfaces = `${paramTypesInterface}\n\n${returnTypesInterface}`;

  return interfaces;
}