import { TransformConfig } from './config.js';
export type IWorkerResult = {
    skipped: boolean;
    typeDecsLength: number;
    relativePath: string;
} | {
    error: any;
    relativePath: string;
};
export declare function getTypeDecs({ fileName, transform, }: {
    fileName: string;
    transform: TransformConfig;
}): Promise<import("./generator.js").TypeDeclarationSet>;
export type getTypeDecsFnResult = ReturnType<typeof getTypeDecs>;
export declare function processFile({ fileName, transform, }: {
    fileName: string;
    transform: TransformConfig;
}): Promise<IWorkerResult>;
export type processFileFnResult = ReturnType<typeof processFile>;
