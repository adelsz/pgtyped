/** @fileoverview Config file parser */
/// <reference types="node" resolution-mode="require"/>
import { Type } from '@pgtyped/query';
import * as t from 'io-ts';
import tls from 'tls';
import { TypeDefinition } from './types.js';
declare const TSTypedSQLTagTransformCodec: t.TypeC<{
    mode: t.LiteralC<"ts-implicit">;
    include: t.StringC;
    functionName: t.StringC;
    emitFileName: t.StringC;
}>;
export type TSTypedSQLTagTransformConfig = t.TypeOf<typeof TSTypedSQLTagTransformCodec>;
declare const TransformCodec: t.UnionC<[t.TypeC<{
    include: t.StringC;
    /** @deprecated emitFileName is deprecated */
    emitFileName: t.UnionC<[t.StringC, t.UndefinedC]>;
    emitTemplate: t.UnionC<[t.StringC, t.UndefinedC]>;
    mode: t.LiteralC<"ts">;
}>, t.TypeC<{
    include: t.StringC;
    /** @deprecated emitFileName is deprecated */
    emitFileName: t.UnionC<[t.StringC, t.UndefinedC]>;
    emitTemplate: t.UnionC<[t.StringC, t.UndefinedC]>;
    mode: t.LiteralC<"sql">;
}>, t.TypeC<{
    mode: t.LiteralC<"ts-implicit">;
    include: t.StringC;
    functionName: t.StringC;
    emitFileName: t.StringC;
}>]>;
export type TransformConfig = t.TypeOf<typeof TransformCodec>;
declare const configParser: t.TypeC<{
    maxWorkerThreads: t.UnionC<[t.NumberC, t.UndefinedC]>;
    transforms: t.ArrayC<t.UnionC<[t.TypeC<{
        include: t.StringC;
        /** @deprecated emitFileName is deprecated */
        emitFileName: t.UnionC<[t.StringC, t.UndefinedC]>;
        emitTemplate: t.UnionC<[t.StringC, t.UndefinedC]>;
        mode: t.LiteralC<"ts">;
    }>, t.TypeC<{
        include: t.StringC;
        /** @deprecated emitFileName is deprecated */
        emitFileName: t.UnionC<[t.StringC, t.UndefinedC]>;
        emitTemplate: t.UnionC<[t.StringC, t.UndefinedC]>;
        mode: t.LiteralC<"sql">;
    }>, t.TypeC<{
        mode: t.LiteralC<"ts-implicit">;
        include: t.StringC;
        functionName: t.StringC;
        emitFileName: t.StringC;
    }>]>>;
    srcDir: t.StringC;
    failOnError: t.UnionC<[t.BooleanC, t.UndefinedC]>;
    camelCaseColumnNames: t.UnionC<[t.BooleanC, t.UndefinedC]>;
    hungarianNotation: t.UnionC<[t.BooleanC, t.UndefinedC]>;
    nonEmptyArrayParams: t.UnionC<[t.BooleanC, t.UndefinedC]>;
    dbUrl: t.UnionC<[t.StringC, t.UndefinedC]>;
    db: t.UnionC<[t.TypeC<{
        host: t.UnionC<[t.StringC, t.UndefinedC]>;
        password: t.UnionC<[t.StringC, t.UndefinedC]>;
        port: t.UnionC<[t.NumberC, t.UndefinedC]>;
        user: t.UnionC<[t.StringC, t.UndefinedC]>;
        dbName: t.UnionC<[t.StringC, t.UndefinedC]>;
        ssl: t.UnionC<[t.UnknownRecordC, t.BooleanC, t.UndefinedC]>;
    }>, t.UndefinedC]>;
    typesOverrides: t.UnionC<[t.RecordC<t.StringC, t.UnionC<[t.StringC, t.TypeC<{
        parameter: t.UnionC<[t.StringC, t.UndefinedC]>;
        return: t.UnionC<[t.StringC, t.UndefinedC]>;
    }>]>>, t.UndefinedC]>;
}>;
export type IConfig = typeof configParser._O;
export interface ParsedConfig {
    db: {
        host: string;
        user: string;
        password: string | undefined;
        dbName: string;
        port: number;
        ssl?: tls.ConnectionOptions | boolean;
    };
    maxWorkerThreads: number | undefined;
    failOnError: boolean;
    camelCaseColumnNames: boolean;
    hungarianNotation: boolean;
    nonEmptyArrayParams: boolean;
    transforms: IConfig['transforms'];
    srcDir: IConfig['srcDir'];
    typesOverrides: Record<string, Partial<TypeDefinition>>;
}
export declare function stringToType(str: string): Type;
export declare function parseConfig(path: string, argConnectionUri?: string): ParsedConfig;
export {};
