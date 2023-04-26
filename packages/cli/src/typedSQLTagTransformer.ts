import chokidar from 'chokidar';
import fs from 'fs-extra';
import { globSync } from 'glob';
import path from 'path';
import { ParsedConfig, TSTypedSQLTagTransformConfig } from './config.js';
import {
  generateDeclarations,
  genTypedSQLOverloadFunctions,
  TypeDeclarationSet,
} from './generator.js';
import { TransformJob, WorkerPool } from './index.js';
import { TypeAllocator } from './types.js';
import { debug } from './util.js';
import { getTypeDecsFnResult } from './worker.js';

type TypedSQLTagTransformResult = TypeDeclarationSet | undefined;

export class TypedSQLTagTransformer {
  public readonly workQueue: Promise<TypedSQLTagTransformResult>[] = [];
  private readonly cache: Record<string, TypeDeclarationSet> = {};
  private readonly includePattern: string;
  private readonly localFileName: string;
  private readonly fullFileName: string;

  constructor(
    private readonly pool: WorkerPool,
    private readonly config: ParsedConfig,
    private readonly transform: TSTypedSQLTagTransformConfig,
  ) {
    this.includePattern = `${this.config.srcDir}/**/${transform.include}`;
    this.localFileName = `${this.config.srcDir}${this.transform.emitFileName}`;
    this.fullFileName = path.relative(process.cwd(), this.localFileName);
  }

  private async watch() {
    let initialized = false;

    const cb = async (fileName: string) => {
      const job = {
        files: [fileName],
      };
      !initialized
        ? this.pushToQueue(job)
        : await this.generateTypedSQLTagFileForJob(job, true);
    };

    chokidar
      .watch(this.includePattern, {
        persistent: true,
        ignored: [this.localFileName],
      })
      .on('add', cb)
      .on('change', cb)
      .on('unlink', async (file) => await this.removeFileFromCache(file))
      .on('ready', async () => {
        initialized = true;
        await this.waitForTypedSQLQueueAndGenerate(true);
      });
  }

  public async start(watch: boolean) {
    if (watch) {
      return this.watch();
    }

    let fileList = globSync(this.includePattern, {
      ignore: [this.localFileName],
    });

    debug('found query files %o', fileList);

    await this.generateTypedSQLTagFileForJob({
      files: fileList,
    });
  }

  private pushToQueue(job: TransformJob) {
    this.workQueue.push(
      ...job.files.map((fileName) => this.getTsTypeDecs(fileName)),
    );
  }

  private async getTsTypeDecs(
    fileName: string,
  ): Promise<TypedSQLTagTransformResult> {
    console.log(`Processing ${fileName}`);
    return (await this.pool.run(
      {
        fileName,
        transform: this.transform,
      },
      'getTypeDecs',
    )) as Awaited<getTypeDecsFnResult>;
    // Result should be serializable!
  }

  private async generateTypedSQLTagFileForJob(
    job: TransformJob,
    useCache?: boolean,
  ) {
    this.pushToQueue(job);
    return this.waitForTypedSQLQueueAndGenerate(useCache);
  }

  private async waitForTypedSQLQueueAndGenerate(useCache?: boolean) {
    const queueResults = await Promise.all(this.workQueue);
    this.workQueue.length = 0;

    const typeDecsSets: TypeDeclarationSet[] = [];

    for (const result of queueResults) {
      if (result) {
        if (result.typedQueries.length > 0) typeDecsSets.push(result);
        if (useCache) this.cache[result.fileName] = result;
      }
    }

    return this.generateTypedSQLTagFile(typeDecsSets);
  }

  private async removeFileFromCache(fileToRemove: string) {
    delete this.cache[fileToRemove];
    return this.generateTypedSQLTagFile(Object.values(this.cache));
  }

  private contentStart = `/* eslint-disable */\nimport { ${this.transform.functionName} as sourceSql } from '@pgtyped/runtime';\n\n`;
  private contentEnd = [
    `export function ${this.transform.functionName}(s: string): unknown;`,
    `export function ${this.transform.functionName}(s: string): unknown {`,
    `  return sourceSql([s] as any);`,
    `}`,
  ];

  private async generateTypedSQLTagFile(typeDecsSets: TypeDeclarationSet[]) {
    console.log(`Generating ${this.fullFileName}...`);
    const typeDefinitions = typeDecsSets
      .map((typeDecSet) =>
        TypeAllocator.typeDefinitionDeclarations(
          this.transform.emitFileName,
          typeDecSet.typeDefinitions,
        ),
      )
      .filter((s) => s)
      .join('\n');

    const queryTypes = typeDecsSets
      .map((typeDecSet) => generateDeclarations(typeDecSet.typedQueries))
      .join('\n');

    const typedSQLOverloadFns = typeDecsSets
      .map((set) =>
        genTypedSQLOverloadFunctions(this.transform.functionName, set),
      )
      .join('\n');

    let content = this.contentStart;
    content += typeDefinitions;
    content += queryTypes;
    content += typedSQLOverloadFns;
    content += this.contentEnd.join('\n');
    await fs.outputFile(this.fullFileName, content);
    console.log(`Saved ${this.fullFileName}`);
  }
}
