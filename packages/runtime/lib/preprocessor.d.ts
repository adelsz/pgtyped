export type Scalar = string | number | null;
export declare enum ParameterTransform {
    Scalar = 0,
    Spread = 1,
    Pick = 2,
    PickSpread = 3
}
export interface ScalarParameter {
    name: string;
    type: ParameterTransform.Scalar;
    required: boolean;
    assignedIndex: number;
}
export interface DictParameter {
    name: string;
    type: ParameterTransform.Pick;
    dict: {
        [key: string]: ScalarParameter;
    };
}
export interface ScalarArrayParameter {
    name: string;
    type: ParameterTransform.Spread;
    required: boolean;
    assignedIndex: number | number[];
}
export interface DictArrayParameter {
    name: string;
    type: ParameterTransform.PickSpread;
    dict: {
        [key: string]: ScalarParameter;
    };
}
export type QueryParameter = ScalarParameter | ScalarArrayParameter | DictParameter | DictArrayParameter;
export interface InterpolatedQuery {
    query: string;
    mapping: QueryParameter[];
    bindings: Scalar[];
}
export interface NestedParameters {
    [subParamName: string]: Scalar;
}
export interface QueryParameters {
    [paramName: string]: Scalar | NestedParameters | Scalar[] | NestedParameters[];
}
export declare function replaceIntervals(str: string, intervals: {
    a: number;
    b: number;
    sub: string;
}[]): string;
