/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { AsyncQueue } from '@pgtyped/wire';
import * as tls from 'tls';
import type { InterpolatedQuery, QueryParameter } from '@pgtyped/runtime';
import { MappableType } from './type.js';
export declare const generateHash: (username: string, password: string, salt: Buffer) => string;
export declare function startup(options: {
    host: string;
    password?: string;
    port: number;
    user: string;
    dbName: string;
    ssl?: tls.ConnectionOptions | boolean;
}, queue: AsyncQueue): Promise<void>;
export declare function runQuery(query: string, queue: AsyncQueue): Promise<string[][]>;
export interface IQueryTypes {
    paramMetadata: {
        mapping: QueryParameter[];
        params: MappableType[];
    };
    returnTypes: Array<{
        returnName: string;
        columnName: string;
        type: MappableType;
        nullable?: boolean;
        comment?: string;
    }>;
}
export interface IParseError {
    errorCode: string;
    hint?: string;
    message: string;
    position?: string;
}
interface TypeField {
    name: string;
    tableOID: number;
    columnAttrNumber: number;
    typeOID: number;
    typeSize: number;
    typeModifier: number;
    formatCode: number;
}
type TypeData = {
    fields: Array<TypeField>;
    params: Array<{
        oid: number;
    }>;
} | IParseError;
/**
 * Returns the raw query type data as returned by the Describe message
 * @param query query string, can only contain proper Postgres numeric placeholders
 * @param query name, should be unique per query body
 * @param queue
 */
export declare function getTypeData(query: string, queue: AsyncQueue): Promise<TypeData>;
declare enum TypeCategory {
    ARRAY = "A",
    BOOLEAN = "B",
    COMPOSITE = "C",
    DATE_TIME = "D",
    ENUM = "E",
    GEOMETRIC = "G",
    NETWORK_ADDRESS = "I",
    NUMERIC = "N",
    PSEUDO = "P",
    STRING = "S",
    TIMESPAN = "T",
    USERDEFINED = "U",
    BITSTRING = "V",
    UNKNOWN = "X"
}
interface TypeRow {
    oid: string;
    typeName: string;
    typeKind: string;
    enumLabel: string;
    typeCategory?: TypeCategory;
    elementTypeOid?: string;
}
export declare function reduceTypeRows(typeRows: TypeRow[]): Record<string, MappableType>;
export declare function getTypes(queryData: InterpolatedQuery, queue: AsyncQueue): Promise<IQueryTypes | IParseError>;
export {};
