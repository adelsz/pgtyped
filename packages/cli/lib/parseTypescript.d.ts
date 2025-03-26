import { ParseEvent, TSQueryAST } from '@pgtyped/parser';
import ts from 'typescript';
import { TransformConfig } from './config.js';
export type TSParseResult = {
    queries: TSQueryAST[];
    events: ParseEvent[];
};
export declare function parseFile(sourceFile: ts.SourceFile, transformConfig: TransformConfig | undefined): TSParseResult;
export declare const parseCode: (fileContent: string, fileName?: string, transformConfig?: TransformConfig) => TSParseResult;
