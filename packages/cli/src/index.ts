#!/usr/bin/env node

import { startup } from '@pgtyped/query';
import { AsyncQueue } from '@pgtyped/wire';
import chokidar from 'chokidar';
import nun from 'nunjucks';

import PiscinaPool from 'piscina';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { parseConfig, ParsedConfig, TransformConfig } from './config.js';
import { TypedSqlTagTransformer } from './typedSqlTagTransformer.js';
import { TypescriptAndSqlTransformer } from './typescriptAndSqlTransformer.js';
import { debug } from './util.js';

// tslint:disable:no-console

nun.configure({ autoescape: false });

export interface TransformJob {
  files: string[];
}

export class WorkerPool {
  private pool: PiscinaPool;

  constructor(private readonly config: ParsedConfig) {
    this.pool = new PiscinaPool({
      filename: new URL('./worker.js', import.meta.url).href,
      maxThreads: config.maxWorkerThreads,
      workerData: config,
    });
    console.log(`Using a pool of ${this.pool.threads.length} threads.`);
  }

  public async shutdown() {
    await this.pool.destroy();
  }

  public async run<T>(opts: T, functionName: string) {
    try {
      return this.pool.run(opts, { name: functionName });
    } catch (err) {
      if (err instanceof Error) {
        const isWorkerTermination = err.message === 'Terminating worker thread';
        if (isWorkerTermination) {
          return;
        }
        console.log(
          `Error processing file: ${err.stack || JSON.stringify(err)}`,
        );
        if (this.config.failOnError) {
          await this.pool.destroy();
          process.exit(1);
        }
      }
    }
  }
}

async function main(
  cfg: ParsedConfig | Promise<ParsedConfig>,
  // tslint:disable-next-line:no-shadowed-variable
  isWatchMode: boolean,
  // tslint:disable-next-line:no-shadowed-variable
  fileOverride?: string,
) {
  const config = await cfg;
  const connection = new AsyncQueue();
  debug('starting codegenerator');
  await startup(config.db, connection);

  debug('connected to database %o', config.db.dbName);

  const pool = new WorkerPool(config);

  const transformTask = async (transform: TransformConfig) => {
    if (transform.mode === 'ts-implicit') {
      const transformer = new TypedSqlTagTransformer(pool, config, transform);
      return transformer.start(isWatchMode);
    } else {
      const transformer = new TypescriptAndSqlTransformer(
        pool,
        config,
        transform,
      );
      return transformer.start(isWatchMode);
    }
  };

  const tasks = config.transforms.map(transformTask);

  if (!isWatchMode) {
    const transforms = await Promise.all(tasks);
    if (fileOverride && !transforms.some((x) => x)) {
      console.log(
        'File override specified, but file was not found in provided transforms',
      );
    }
    await pool.shutdown();
    process.exit(0);
  }
}

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
      description: 'File path (process single file, incompatible with --watch)',
    },
  })
  .epilogue('For more information, find our manual at https://pgtyped.dev/')
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
  chokidar.watch(configPath).on('change', () => {
    console.log('Config file changed. Exiting.');
    process.exit();
  });
  const config = parseConfig(configPath, connectionUri);
  main(config, isWatchMode || false, fileOverride).catch((e) =>
    debug('error in main: %o', e.message),
  );
} catch (e) {
  console.error('Failed to parse config file:');
  console.error((e as any).message);
  process.exit();
}
