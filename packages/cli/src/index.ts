#!/usr/bin/env node

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

async function main(config: IConfig) {
  const { emit: emitMode } = config;
  if (emitMode.mode !== 'query-file') {
    console.log('Unsupported emit mode.\nExiting.')
    return;
  }
  const fileList = glob.sync(`${config.srcDir}/**/${emitMode.queryFileName}`);
  console.log(fileList)
  const connection = new AsyncQueue();
  debug('starting codegenerator')
  await startup({
    user: config.db.user,
    database: config.db.dbName,
  }, connection);
  debug('connected to database %o', config.db.dbName)
}

const configResult = parseConfig(configPath);
if (Option.isNone(configResult)) {
  console.log('Config file parsing failed.')
  process.exit()
} else {
  main(configResult.value).catch((e) => debug('error in main: %o', e.message));
}