#!/usr/bin/env node

import fs from 'fs';
import debugBase from 'debug';
import glob from 'glob';
import minimist from 'minimist';
import {
  AsyncQueue,
  startup,
} from '@pg-typed/query';
import {
  parseConfig, IConfig,
} from './config';
import * as Option from 'fp-ts/lib/Option';
import { parseCode } from './parser';
import { queryToInterface } from './generator';

const args = minimist(process.argv.slice(2));

const helpMessage = `PostgreSQL type generator flags:
  -h --help      Display this message
  -c             Config file (required)`;

if (args.h || args.help) {
  console.log(helpMessage)
  process.exit()
}

const { c: configPath } = args;

if (
  typeof configPath !== 'string'
) {
  console.log('Config file required. See help -h for details.\nExiting.')
  process.exit()
}

export const debug = debugBase('pg-typegen');

interface TypedQuery {
  fileName: string;
  queryName: string;
  typeDeclaration: string;
};

async function main(config: IConfig) {
  const { emit: emitMode } = config;
  if (emitMode.mode !== 'query-file') {
    console.log('Unsupported emit mode.\nExiting.')
    return;
  }

  const connection = new AsyncQueue();
  debug('starting codegenerator')
  await startup({
    user: config.db.user,
    database: config.db.dbName,
  }, connection);

  debug('connected to database %o', config.db.dbName)
  const fileList = glob.sync(`${config.srcDir}/**/${emitMode.queryFileName}`);
  debug('found query files %o', fileList)

  const results: TypedQuery[] = [];
  for (const fileName of fileList) {
    const contents = fs.readFileSync(fileName).toString();
    const queries = parseCode(contents, fileName);
    for (const query of queries) {
      const typedQuery = ({
        fileName,
        queryName: query.queryName,
        typeDeclaration: await queryToInterface(
          { body: query.tagContent, name: query.queryName },
          connection,
        )
      });
      results.push(typedQuery);
    }
    console.log(results)
  }
}

const configResult = parseConfig(configPath);
if (Option.isNone(configResult)) {
  console.log('Config file parsing failed.')
  process.exit()
} else {
  main(configResult.value).catch((e) => debug('error in main: %o', e.message));
}