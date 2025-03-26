import { SQLQueryAST, SQLQueryIR, TSQueryAST } from '@pgtyped/parser';
import { TypeSource } from '@pgtyped/query';
import { ParsedConfig, TransformConfig } from './config.js';
import { TypeAllocator, TypeDefinitions } from './types.js';
export declare enum ProcessingMode {
    SQL = "sql-file",
    TS = "query-file"
}
export interface IField {
    optional?: boolean;
    fieldName: string;
    fieldType: string;
    comment?: string;
}
export declare function escapeComment(comment: string): string;
/** Escape a key if it isn't an identifier literal */
export declare function escapeKey(key: string): string;
export declare const generateInterface: (interfaceName: string, fields: IField[]) => string;
export declare const generateTypeAlias: (typeName: string, alias: string) => string;
type ParsedQuery = {
    ast: TSQueryAST;
    mode: ProcessingMode.TS;
} | {
    ast: SQLQueryAST;
    mode: ProcessingMode.SQL;
};
export declare function queryToTypeDeclarations(parsedQuery: ParsedQuery, typeSource: TypeSource, types: TypeAllocator, config: ParsedConfig): Promise<string>;
export type TSTypedQuery = {
    mode: 'ts';
    fileName: string;
    query: {
        name: string;
        ast: TSQueryAST;
        queryTypeAlias: string;
    };
    typeDeclaration: string;
};
type SQLTypedQuery = {
    mode: 'sql';
    fileName: string;
    query: {
        name: string;
        ast: SQLQueryAST;
        ir: SQLQueryIR;
        paramTypeAlias: string;
        returnTypeAlias: string;
    };
    typeDeclaration: string;
};
export type TypedQuery = TSTypedQuery | SQLTypedQuery;
export type TypeDeclarationSet = {
    typedQueries: TypedQuery[];
    typeDefinitions: TypeDefinitions;
    fileName: string;
};
export declare function generateTypedecsFromFile(contents: string, fileName: string, connection: any, transform: TransformConfig, types: TypeAllocator, config: ParsedConfig): Promise<TypeDeclarationSet>;
export declare function generateDeclarations(typeDecs: TypedQuery[]): string;
export declare function generateDeclarationFile(typeDecSet: TypeDeclarationSet): string;
export declare function genTypedSQLOverloadFunctions(functionName: string, typedQueries: TSTypedQuery[]): string;
export {};
