export type Scalar = string | number | null;

export enum ParamTransform {
  Scalar,
  Spread,
  Pick,
  PickSpread,
}

export interface IScalarParam {
  name: string;
  type: ParamTransform.Scalar;
  assignedIndex: number;
}

export interface IDictParam {
  name: string;
  type: ParamTransform.Pick;
  dict: {
    [key: string]: IScalarParam;
  };
}

export interface IScalarArrayParam {
  name: string;
  type: ParamTransform.Spread;
  assignedIndex: number | number[];
}

export interface IDictArrayParam {
  name: string;
  type: ParamTransform.PickSpread;
  dict: {
    [key: string]: IScalarParam;
  };
}

export type QueryParam =
  | IScalarParam
  | IScalarArrayParam
  | IDictParam
  | IDictArrayParam;

export interface IInterpolatedQuery {
  query: string;
  mapping: QueryParam[];
  bindings: Scalar[];
}

export interface INestedParameters {
  [subParamName: string]: Scalar;
}

export interface IQueryParameters {
  [paramName: string]:
    | Scalar
    | INestedParameters
    | Scalar[]
    | INestedParameters[];
}

export function replaceIntervals(
  str: string,
  intervals: { a: number; b: number; sub: string }[],
) {
  if (intervals.length === 0) {
    return str;
  }
  intervals.sort((x, y) => x.a - y.a);
  let offset = 0;
  let result = '';
  for (const interval of intervals) {
    const a = str.slice(0, interval.a + offset);
    const b = str.slice(interval.a + offset, interval.b + offset + 1);
    const c = str.slice(interval.b + offset + 1, str.length);
    result = a + interval.sub + c;
    offset += result.length - str.length;
    str = result;
  }
  return result;
}
