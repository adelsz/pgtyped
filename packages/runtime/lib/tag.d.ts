import { SQLQueryIR, TSQueryAST } from '@pgtyped/parser';
export interface ICursor<T> {
    read(rowCount: number): Promise<T>;
    close(): Promise<void>;
}
export interface IDatabaseConnection {
    query: (query: string, bindings: any[]) => Promise<{
        rows: any[];
        rowCount: number;
    }>;
    stream?: (query: string, bindings: any[]) => ICursor<any[]>;
}
export declare class TaggedQuery<TTypePair extends {
    params: any;
    result: any;
}> {
    run: (params: TTypePair['params'], dbConnection: IDatabaseConnection) => Promise<Array<TTypePair['result']>>;
    stream: (params: TTypePair['params'], dbConnection: IDatabaseConnection) => ICursor<Array<TTypePair['result']>>;
    private readonly query;
    constructor(query: TSQueryAST);
}
interface ITypePair {
    params: any;
    result: any;
}
export declare const sql: <TTypePair extends ITypePair>(stringsArray: TemplateStringsArray) => TaggedQuery<TTypePair>;
export declare class PreparedQuery<TParamType, TResultType> {
    run: (params: TParamType, dbConnection: IDatabaseConnection) => Promise<Array<TResultType>>;
    runWithCounts: (params: TParamType, dbConnection: IDatabaseConnection) => Promise<{
        result: Array<TResultType>;
        rowCount: number;
    }>;
    stream: (params: TParamType, dbConnection: IDatabaseConnection) => ICursor<Array<TResultType>>;
    private readonly queryIR;
    constructor(queryIR: SQLQueryIR);
}
export default sql;
