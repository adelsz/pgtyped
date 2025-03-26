import { ParseEvent } from '../sql/logger.js';
export declare enum ParamType {
    Scalar = "scalar",
    Object = "object",
    ScalarArray = "scalar_array",
    ObjectArray = "object_array"
}
export interface ParamKey {
    name: string;
    required: boolean;
}
export type ParamSelection = {
    type: ParamType.Scalar;
} | {
    type: ParamType.ScalarArray;
} | {
    type: ParamType.Object | ParamType.ObjectArray;
    keys: ParamKey[];
};
export interface Param {
    name: string;
    selection: ParamSelection;
    required: boolean;
    location: CodeInterval;
}
interface CodeInterval {
    a: number;
    b: number;
    line: number;
    col: number;
}
export interface Query {
    name: string;
    params: Param[];
    text: string;
}
export declare function assert(condition: any): asserts condition;
declare function parseText(text: string, queryName?: string): {
    query: Query;
    events: ParseEvent[];
};
export default parseText;
