#!/usr/bin/env node

import { AsyncQueue, startup } from '@pgtyped/query';
import JestWorker from 'jest-worker';
import chokidar from 'chokidar';
import glob from 'glob';
import nun from 'nunjucks';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { parseConfig, ParsedConfig, TransformConfig } from './config';
import { debug } from './util';
import { WorkerInterface, processFile } from './worker';
import path from 'path';

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
  private readonly worker: WorkerInterface;
  public readonly workQueue: Promise<unknown>[] = [];

  constructor(private readonly config: ParsedConfig) {
    this.worker = new JestWorker(require.resolve('./worker'), {
      exposedMethods: ['processFile'],
      setupArgs: [this.config],
      computeWorkerKey: (method, fileName): string | null => {
        switch (method) {
          case processFile.name:
            return fileName as string;
          default:
            return null;
        }
      },
    }) as WorkerInterface;
  }

  public push(job: TransformJob) {
    this.workQueue.push(
      ...job.files.map(async (fileName) => {
        try {
          fileName = path.relative(process.cwd(), fileName);
          const result = await this.worker.processFile(fileName, job.transform);
          if (result) {
            console.log(
              `Saved ${result.typeDecsLength} query types from ${fileName} to ${result.relativePath}`,
            );
          }
        } catch (err) {
          if (err instanceof Error) {
            console.log(
              `Error processing file: ${err.stack || JSON.stringify(err)}`,
            );
          } else {
            console.log(`Error processing file: ${JSON.stringify(err)}`);
          }
          if (this.config.failOnError) {
            await this.worker.end();
            process.exit(1);
          }
        }
      }),
    );
  }
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

  const fileProcessor = new FileProcessor(config);
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
    await Promise.all(fileProcessor.workQueue);
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
