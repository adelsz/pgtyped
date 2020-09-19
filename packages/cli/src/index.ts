#!/usr/bin/env node

import { AsyncQueue, startup } from '@pgtyped/query';
import JestWorker from 'jest-worker';
import chokidar from 'chokidar';
import glob from 'glob';
import minimist from 'minimist';
import nun from 'nunjucks';
import { parseConfig, ParsedConfig, TransformConfig } from './config';
import { debug } from './util';
import { WorkerInterface } from './worker';

const args = minimist(process.argv.slice(2));

nun.configure({ autoescape: false });

// tslint:disable:no-console
const helpMessage = `PostgreSQL type generator flags:
  -w --watch     Watch mode
  -h --help      Display this message
  -c             Config file (required)`;

export enum ProcessingMode {
  SQL = 'sql-file',
  TS = 'query-file',
}

interface TransformJob {
  files: string[];
  transform: TransformConfig;
}

class FileProcessor {
  public readonly emptyQueue: Promise<void>;
  private readonly jobQueue: TransformJob[] = [];
  private activePromise: Promise<void> | null = null;
  private readonly worker: WorkerInterface;

  constructor(private readonly config: ParsedConfig) {
    this.emptyQueue = new Promise((resolve, reject) => {
      this.resolveDone = resolve;
    });
    this.worker = new JestWorker(require.resolve('./worker'), {
      exposedMethods: ['processFile'],
      setupArgs: [this.config],
    }) as WorkerInterface;
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

  private async processJob(job: TransformJob) {
    for (const fileName of job.files) {
      console.log(`Processing ${fileName}`);
      const result = await this.worker.processFile(fileName, job.transform);
      if (result) {
        console.log(
          `Saved ${result.typeDecsLength} query types to ${result.relativePath}`,
        );
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
      this.activePromise = this.processJob(nextJob)
        .then(this.onFileProcessed)
        .catch(this.onFileProcessingError);
    } else {
      this.resolveDone();
    }
  };
}

async function main(config: ParsedConfig, isWatchMode: boolean) {
  const fileProcessor = new FileProcessor(config);
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
