#!/usr/bin/env node

import fs from 'fs';
import debugBase from 'debug';
import glob from 'glob';
import minimist from 'minimist';
import {
  AsyncQueue,
  startup,
  ParseError,
} from '@pg-typed/query';
import {
  parseConfig, IConfig,
} from './config';
import * as Option from 'fp-ts/lib/Option';
import { parseCode } from './parser';
import { queryToTypeDeclarations } from './generator';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

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


async function processFile(fileName: string, connection: any) {
  const results: TypedQuery[] = [];
  const contents = fs.readFileSync(fileName).toString();
  const queries = parseCode(contents, fileName);
  for (const query of queries) {
    const result = await queryToTypeDeclarations(
      { body: query.tagContent, name: query.queryName },
      connection,
    );
    const typedQuery = ({
      fileName,
      queryName: query.queryName,
      typeDeclaration: result,
    });
    results.push(typedQuery);
  }
  return results;
}

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

  for (const fileName of fileList) {
    const decsFileName = path.resolve(
      path.dirname(fileName),
      path.basename(fileName, 'ts') + 'types.d.ts',
    );
    const typeDecs = await processFile(fileName, connection);
    let declarationFileContents = `/** Types generated for queries found in "${fileName}" */\n\n`;
    for (const typeDec of typeDecs) {
      declarationFileContents += typeDec.typeDeclaration + '\n';
    }
    await writeFile(decsFileName, declarationFileContents);
    console.log(`Saved ${typeDecs.length} query types to ${path.relative(process.cwd(), decsFileName)}`);
  }
  process.exit();
}

const configResult = parseConfig(configPath);
if (Option.isNone(configResult)) {
  console.log('Config file parsing failed.')
  process.exit()
} else {
  main(configResult.value).catch((e) => debug('error in main: %o', e.message));
}