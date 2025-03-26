import { ParseEvent } from './logger.js';
export declare enum TransformType {
    Scalar = "scalar",
    PickTuple = "pick_tuple",
    ArraySpread = "array_spread",
    PickArraySpread = "pick_array_spread"
}
export interface ParamKey {
    name: string;
    required: boolean;
}
export type ParamTransform = {
    type: TransformType.Scalar;
} | {
    type: TransformType.ArraySpread;
} | {
    type: TransformType.PickTuple | TransformType.PickArraySpread;
    keys: ParamKey[];
};
export interface Param {
    name: string;
    transform: ParamTransform;
    required: boolean;
    codeRefs: {
        defined?: CodeInterval;
        used: CodeInterval[];
    };
}
interface CodeInterval {
    a: number;
    b: number;
    line: number;
    col: number;
}
interface Statement {
    loc: CodeInterval;
    body: string;
}
export interface QueryAST {
    name: string;
    params: Param[];
    statement: Statement;
    usedParamSet: {
        [paramName: string]: true;
    };
}
export interface ParamIR {
    name: string;
    transform: ParamTransform;
    required: boolean;
    locs: {
        a: number;
        b: number;
    }[];
}
export interface QueryIR {
    params: ParamIR[];
    statement: string;
    usedParamSet: QueryAST['usedParamSet'];
}
export declare function assert(condition: any): asserts condition;
export type SQLParseResult = {
    queries: QueryAST[];
    events: ParseEvent[];
};
declare function parseText(text: string): SQLParseResult;
export declare function queryASTToIR(query: SQLQueryAST): SQLQueryIR;
export { prettyPrintEvents, ParseEvent } from './logger.js';
export type SQLQueryAST = QueryAST;
export type SQLQueryIR = QueryIR;
export default parseText;
