import { ParsedConfig, TransformConfig } from './config.js';
import { TransformJob, WorkerPool } from './index.js';
export declare class TypescriptAndSqlTransformer {
    private readonly pool;
    private readonly config;
    private readonly transform;
    readonly workQueue: Promise<unknown>[];
    private readonly includePattern;
    private fileOverrideUsed;
    constructor(pool: WorkerPool, config: ParsedConfig, transform: TransformConfig);
    private watch;
    start(watch: boolean, fileOverride?: string): Promise<boolean | void>;
    private processFile;
    pushToQueue(job: TransformJob): void;
}
