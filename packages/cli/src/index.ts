#!/usr/bin/env node

import debugBase from 'debug';
import minimist from 'minimist';
import {
  AsyncQueue,
  startup,
} from '@pg-typed/query';

const args = minimist(process.argv.slice(2));

export const debug = debugBase('pg-typegen');

const connection = new AsyncQueue();

async function main() {
  debug('starting codegenerator')
  await startup({
    user: 'adel',
    database: 'testdb'
  }, connection);
}


main().catch((e) => debug('error in main: %o', e.message));