#!/usr/bin/env node

import fs from 'fs';
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
import { debug } from './util';
import * as Option from 'fp-ts/lib/Option';
import { parseCode } from './parser';
import { queryToTypeDeclarations } from './generator';
import path from 'path';
import { promisify } from 'util';
import chokidar from 'chokidar';

const writeFile = promisify(fs.writeFile);

const args = minimist(process.argv.slice(2));

const helpMessage = `PostgreSQL type generator flags:
  -w --watch     Watch mode
  -h --help      Display this message
  -c             Config file (required)`;

if (args.h || args.help) {
  console.log(helpMessage)
  process.exit(0)
}

const {
  c: configPath,
  w: isWatchMode,
} = args;

if (typeof configPath !== 'string') {
  console.log('Config file required. See help -h for details.\nExiting.')
  process.exit(0)
}

interface TypedQuery {
  fileName: string;
  queryName: string;
  typeDeclaration: string;
};

async function generateTypedecsFromFile(fileName: string, connection: any) {
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

const processFile = async (connection: any, fileName: string) => {
  console.log(`Processing ${fileName}`)
  const decsFileName = path.resolve(
    path.dirname(fileName),
    path.basename(fileName, 'ts') + 'types.ts',
  );
  const typeDecs = await generateTypedecsFromFile(fileName, connection);
  let declarationFileContents = `/** Types generated for queries found in "${fileName}" */\n\n`;
  for (const typeDec of typeDecs) {
    declarationFileContents += typeDec.typeDeclaration + '\n';
  }
  await writeFile(decsFileName, declarationFileContents);
  console.log(`Saved ${typeDecs.length} query types to ${path.relative(process.cwd(), decsFileName)}`);
}

class FileProcessor {
  private fileQueue: string[] = [];
  private activePromise: Promise<void> | null = null;
  private connection: any;
  private resolveDone: () => void = () => { };
  public emptyQueue: Promise<void>;

  constructor(connection: any) {
    this.connection = connection;
    this.emptyQueue = new Promise((resolve, reject) => {
      this.resolveDone = resolve;
    });
  }

  private onFileProcessed = () => {
    this.activePromise = null;
    this.processQueue();
  }

  private processQueue = () => {
    if (this.activePromise) {
      this.activePromise.then(this.onFileProcessed);
      return;
    }
    const nextFile = this.fileQueue.pop();
    if (nextFile) {
      this.activePromise = processFile(this.connection, nextFile)
        .then(this.onFileProcessed);
    } else {
      this.resolveDone();
    }
  }

  push(...fileNames: string[]) {
    this.fileQueue.push(...fileNames);
    this.processQueue();
    this.emptyQueue = new Promise((resolve, reject) => {
      this.resolveDone = resolve;
    });
  }
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

  const querySourcesPattern = `${config.srcDir}/**/${emitMode.queryFileName}`;
  const fileProcessor = new FileProcessor(connection);

  if (isWatchMode) {
    chokidar.watch(querySourcesPattern, { persistent: true })
      .on('add', path => fileProcessor.push(path))
      .on('change', path => fileProcessor.push(path))
    return;
  }

  const fileList = glob.sync(querySourcesPattern);
  debug('found query files %o', fileList)
  fileProcessor.push(...fileList);
  await fileProcessor.emptyQueue;

  process.exit(0);
}

const configResult = parseConfig(configPath);
if (Option.isNone(configResult)) {
  console.log('Config file parsing failed.')
  process.exit()
} else {
  main(configResult.value).catch((e) => debug('error in main: %o', e.message));
}
