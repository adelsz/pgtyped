#!/usr/bin/env node

import debugBase from 'debug';
import minimist from 'minimist';
import {
  AsyncQueue,
  startup,
  getTypes,
} from '@pg-typed/query';
import {
  generateInterface, FieldType, IField,
} from './generator';

const args = minimist(process.argv.slice(2));

const debug = debugBase('pg-typegen');

const connection = new AsyncQueue();

async function main() {
  debug('starting codegenerator')
  await startup({
    user: 'adel',
    database: 'testdb'
  }, connection);
}

const typeMap = {
  uuid: FieldType.String,
  text: FieldType.String,
};

export async function queryToInterface(queryName: string, query: string) {
  const {
    returnTypes,
    paramTypes,
  } = await getTypes(query, connection);

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

  if (returnFieldTypes.length > 0) {
    returnTypesInterface = generateInterface(
      `I${queryName}Return`,
      returnFieldTypes
    );
  }

  if (paramFieldTypes.length > 0) {
    paramTypesInterface = generateInterface(
      `I${queryName}Params`,
      paramFieldTypes
    );
  }

  const interfaces = `${paramTypesInterface}\n\n${returnTypesInterface}`;

  return interfaces;
}

main().catch((e) => debug('error in main: %o', e.message));