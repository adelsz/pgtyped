#!/usr/bin/env node

import { AsyncQueue, startup } from '@pgtyped/query';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import glob from 'glob';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import nun from 'nunjucks';
import path from 'path';
import { parseConfig, ParsedConfig, TransformConfig } from './config';
import { generateDeclarationFile } from './generator';
import { debug } from './util';

// tslint:disable:no-console

nun.configure({ autoescape: false });

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

  constructor(private connection: any, private config: ParsedConfig) {
    this.connection = connection;
    this.emptyQueue = new Promise((resolve) => {
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

  private onFileProcessingError = (err: any) => {
    console.log(`Error processing file: ${err.stack || JSON.stringify(err)}`);
    if (this.config.failOnError) {
      process.exit(1);
    }
  };

  private async processJob(connection: any, job: TransformJob) {
    for (let fileName of job.files) {
      fileName = path.relative(process.cwd(), fileName);
      console.log(`Processing ${fileName}`);
      const ppath = path.parse(fileName);
      let decsFileName;
      if (job.transform.emitTemplate) {
        decsFileName = nun.renderString(job.transform.emitTemplate, ppath);
      } else {
        const suffix = job.transform.mode === 'ts' ? 'types.ts' : 'ts';
        decsFileName = path.resolve(ppath.dir, `${ppath.name}.${suffix}`);
      }
      const contents = fs.readFileSync(fileName).toString();
      const {
        declarationFileContents,
        typeDecs,
      } = await generateDeclarationFile(
        contents,
        fileName,
        connection,
        job.transform.mode,
        void 0,
        this.config,
      );
      if (typeDecs.length > 0) {
        const oldDeclarationFileContents = (await fs.pathExists(decsFileName))
          ? await fs.readFile(decsFileName, { encoding: 'utf-8' })
          : null;
        if (oldDeclarationFileContents !== declarationFileContents) {
          await fs.outputFile(decsFileName, declarationFileContents);
          console.log(
            `Saved ${typeDecs.length} query types to ${path.relative(
              process.cwd(),
              decsFileName,
            )}`,
          );
        }
      }
    }
  }

  private processQueue = () => {
    if (this.activePromise) {
      this.activePromise
        .then(this.onFileProcessed)
        .catch(this.onFileProcessingError);
      return;
    }
    const nextJob = this.jobQueue.pop();
    if (nextJob) {
      this.activePromise = this.processJob(this.connection, nextJob)
        .then(this.onFileProcessed)
        .catch(this.onFileProcessingError);
    } else {
      this.resolveDone();
    }
  };
}

async function main(
  config: ParsedConfig,
  isWatchMode: boolean,
  fileOverride?: string,
) {
  const connection = new AsyncQueue();
  debug('starting codegenerator');
  await startup(config.db, connection);

  debug('connected to database %o', config.db.dbName);

  const fileProcessor = new FileProcessor(connection, config);
  let fileOverrideUsed = false;
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
      /**
       * If the user didn't provide the -f paramter, we're using the list of files we got from glob.
       * If he did, we're using glob file list to detect if his provided file should be used with this transform.
       */
      let fileList = glob.sync(pattern);
      if (fileOverride) {
        fileList = fileList.includes(fileOverride) ? [fileOverride] : [];
        if (fileList.length > 0) {
          fileOverrideUsed = true;
        }
      }
      debug('found query files %o', fileList);
      const transformJob = {
        files: fileList,
        transform,
      };
      fileProcessor.push(transformJob);
    }
  }
  if (fileOverride && !fileOverrideUsed) {
    console.log(
      'File override specified, but file was not found in provided transforms',
    );
  }
  if (!isWatchMode) {
    await fileProcessor.emptyQueue;
    process.exit(0);
  }
}

if (require.main === module) {
  const args = yargs(hideBin(process.argv))
    .version()
    .env()
    .options({
      config: {
        alias: 'c',
        type: 'string',
        description: 'Config file path',
        demandOption: true,
      },
      watch: {
        alias: 'w',
        description: 'Watch mode',
        type: 'boolean',
      },
      uri: {
        type: 'string',
        description: 'DB connection URI (overrides config)',
      },
      file: {
        alias: 'f',
        type: 'string',
        conflicts: 'watch',
        description:
          'File path (process single file, incompatible with --watch)',
      },
    })
    .epilogue(
      'For more information, find our manual at https://pgtyped.vercel.app/',
    )
    .parseSync();

  const {
    watch: isWatchMode,
    file: fileOverride,
    config: configPath,
    uri: connectionUri,
  } = args;

  if (typeof configPath !== 'string') {
    console.log('Config file required. See help -h for details.\nExiting.');
    process.exit(0);
  }

  if (isWatchMode && fileOverride) {
    console.log('File override is not compatible with watch mode.\nExiting.');
    process.exit(0);
  }

  try {
    const config = parseConfig(configPath, connectionUri);
    main(config, isWatchMode || false, fileOverride).catch((e) =>
      debug('error in main: %o', e.message),
    );
  } catch (e) {
    console.error('Failed to parse config file:');
    console.error((e as any).message);
    process.exit();
  }
}
