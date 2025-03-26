import { ParsedConfig, TSTypedSQLTagTransformConfig } from './config.js';
import { TypeDeclarationSet } from './generator.js';
import { WorkerPool } from './index.js';
type TypedSQLTagTransformResult = TypeDeclarationSet | undefined;
export declare class TypedSqlTagTransformer {
    private readonly pool;
    private readonly config;
    private readonly transform;
    readonly workQueue: Promise<TypedSQLTagTransformResult>[];
    private readonly cache;
    private readonly includePattern;
    private readonly localFileName;
    private readonly fullFileName;
    constructor(pool: WorkerPool, config: ParsedConfig, transform: TSTypedSQLTagTransformConfig);
    private watch;
    start(watch: boolean): Promise<void>;
    private pushToQueue;
    private getTsTypeDecs;
    private generateTypedSQLTagFileForJob;
    private waitForTypedSQLQueueAndGenerate;
    private removeFileFromCache;
    private contentStart;
    private contentEnd;
    private generateTypedSQLTagFile;
}
export {};
