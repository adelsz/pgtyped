#!/usr/bin/env node
import { ParsedConfig } from './config.js';
export interface TransformJob {
    files: string[];
}
export declare class WorkerPool {
    private readonly config;
    private pool;
    constructor(config: ParsedConfig);
    shutdown(): Promise<void>;
    run<T>(opts: T, functionName: string): Promise<any>;
}
