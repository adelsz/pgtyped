#!/usr/bin/env node

import {
  AsyncQueue,
  startup,
  parseSQLFile,
  parseTypeScriptFile,
  prettyPrintEvents,
  sql,
  QueryAST,
} from '@pgtyped/query';
import chokidar from 'chokidar';
import * as Option from 'fp-ts/lib/Option';
import fs from 'fs';
import glob from 'glob';
import minimist from 'minimist';
import path from 'path';
import { promisify } from 'util';
import { IConfig, parseConfig, TransformConfig } from './config';
import { queryToTypeDeclarations } from './generator';
import { assert, debug } from './util';
import { camelCase } from 'camel-case';
import { pascalCase } from 'pascal-case';

const writeFile = promisify(fs.writeFile);

const args = minimist(process.argv.slice(2));

// tslint:disable:no-console
const helpMessage = `PostgreSQL type generator flags:
  -w --watch     Watch mode
  -h --help      Display this message
  -c             Config file (required)`;

interface ITypedQuery {
  fileName: string;
  query?: {
    name: string;
    ast: QueryAST;
    paramTypeAlias: string;
    returnTypeAlias: string;
  };
  typeDeclaration: string;
}

export enum ProcessingMode {
  SQL = 'sql-file',
  TS = 'query-file',
}

interface TransformJob {
  files: string[];
  transform: TransformConfig;
}

class FileProcessor {
  public emptyQueue: Promise<void>;
  private jobQueue: TransformJob[] = [];
  private activePromise: Promise<void> | null = null;
  private connection: any;

  constructor(connection: any) {
    this.connection = connection;
    this.emptyQueue = new Promise((resolve, reject) => {
      this.resolveDone = resolve;
    });
  }

  public push(job: TransformJob) {
    this.jobQueue.push(job);
    if (!this.activePromise) {
      this.processQueue();
    }
  }

  private resolveDone: () => void = () => undefined;

  private onFileProcessed = () => {
    this.activePromise = null;
    this.processQueue();
  };

  private generateTypedecsFromFile = async (
    fileName: string,
    connection: any,
    mode: 'ts' | 'sql',
  ) => {
    const results: ITypedQuery[] = [];
    const contents = fs.readFileSync(fileName).toString();
    if (mode === 'ts') {
      const queries = parseTypeScriptFile(contents, fileName);
      for (const query of queries) {
        const result = await queryToTypeDeclarations(
          {
            body: query.tagContent,
            name: query.queryName,
            mode: ProcessingMode.TS,
          },
          connection,
        );
        const typedQuery = {
          fileName,
          queryName: query.queryName,
          typeDeclaration: result,
        };
        results.push(typedQuery);
      }
    } else {
      const {
        parseTree: { queries },
        events,
      } = parseSQLFile(contents, fileName);
      if (events.length > 0) {
        prettyPrintEvents(contents, events);
        if (events.find((e) => 'critical' in e)) {
          return results;
        }
      }
      for (const query of queries) {
        const result = await queryToTypeDeclarations(
          { ast: query, mode: ProcessingMode.SQL },
          connection,
        );
        const typedQuery = {
          query: {
            name: camelCase(query.name),
            ast: query,
            paramTypeAlias: `I${pascalCase(query.name)}Params`,
            returnTypeAlias: `I${pascalCase(query.name)}Result`,
          },
          fileName,
          queryName: query.name,
          typeDeclaration: result,
        };
        results.push(typedQuery);
      }
    }
    return results;
  };

  private async processJob(connection: any, job: TransformJob) {
    for (const fileName of job.files) {
      console.log(`Processing ${fileName}`);
      const ext = job.transform.mode === 'ts' ? 'ts' : 'sql';
      const suffix = job.transform.mode === 'ts' ? 'types.ts' : 'ts';
      const decsFileName = path.resolve(
        path.dirname(fileName),
        path.basename(fileName, ext) + suffix,
      );
      const typeDecs = await this.generateTypedecsFromFile(
        fileName,
        connection,
        job.transform.mode,
      );
      if (typeDecs.length === 0) {
        return;
      }
      let declarationFileContents = '';
      declarationFileContents += `/** Types generated for queries found in "${fileName}" */\n\n`;
      if (job.transform.mode === 'sql') {
        declarationFileContents += `import { PreparedQuery } from "@pgtyped/query";\n\n`;
      }
      for (const typeDec of typeDecs) {
        declarationFileContents += typeDec.typeDeclaration;
        if (!typeDec.query) {
          continue;
        }
        const queryPP = typeDec.query.ast.statement.body
          .split('\n')
          .map((s: string) => ' * ' + s)
          .join('\n');
        declarationFileContents += `const ${
          typeDec.query.name
        }IR: any = ${JSON.stringify(typeDec.query.ast)};\n\n`;
        declarationFileContents +=
          `/**\n` +
          ` * Query generated from SQL:\n` +
          ` * \`\`\`\n` +
          `${queryPP}\n` +
          ` * \`\`\`\n` +
          ` */\n`;
        declarationFileContents +=
          `export const ${typeDec.query.name} = ` +
          `new PreparedQuery<${typeDec.query.paramTypeAlias},${typeDec.query.returnTypeAlias}>` +
          `(${typeDec.query.name}IR);\n\n\n`;
      }
      await writeFile(decsFileName, declarationFileContents);
      console.log(
        `Saved ${typeDecs.length} query types to ${path.relative(
          process.cwd(),
          decsFileName,
        )}`,
      );
    }
  }

  private processQueue = () => {
    if (this.activePromise) {
      this.activePromise.then(this.onFileProcessed);
      return;
    }
    const nextJob = this.jobQueue.pop();
    if (nextJob) {
      this.activePromise = this.processJob(this.connection, nextJob).then(
        this.onFileProcessed,
      );
    } else {
      this.resolveDone();
    }
  };
}

async function main(config: IConfig, isWatchMode: boolean) {
  const connection = new AsyncQueue();
  debug('starting codegenerator');
  await startup(
    {
      host: config.db.host,
      user: config.db.user,
      database: config.db.dbName,
      password: config.db.password,
    },
    connection,
  );

  debug('connected to database %o', config.db.dbName);

  const fileProcessor = new FileProcessor(connection);
  for (const transform of config.transforms) {
    const pattern = `${config.srcDir}/**/${transform.include}`;
    if (isWatchMode) {
      const cb = (filePath: string) => {
        fileProcessor.push({
          files: [filePath],
          transform,
        });
      };
      chokidar
        .watch(pattern, { persistent: true })
        .on('add', cb)
        .on('change', cb);
    } else {
      const fileList = glob.sync(pattern);
      debug('found query files %o', fileList);
      const transformJob = {
        files: fileList,
        transform,
      };
      fileProcessor.push(transformJob);
    }
  }
  if (!isWatchMode) {
    await fileProcessor.emptyQueue;
    process.exit(0);
  }
}

if (require.main === module) {
  if (args.h || args.help) {
    console.log(helpMessage);
    process.exit(0);
  }

  const { c: configPath, w: isWatchMode } = args;

  if (typeof configPath !== 'string') {
    console.log('Config file required. See help -h for details.\nExiting.');
    process.exit(0);
  }

  try {
    const config = parseConfig(configPath);
    main(config, isWatchMode).catch((e) =>
      debug('error in main: %o', e.message),
    );
  } catch (e) {
    console.error('Failed to parse config file:');
    console.error(e.message);
    process.exit();
  }
}
