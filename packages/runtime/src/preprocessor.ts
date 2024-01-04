export type Scalar = string | number | null;

export enum ParameterTransform {
  Scalar,
  Spread,
  Pick,
  PickSpread,
}

export interface ScalarParameter {
  name: string;
  type: ParameterTransform.Scalar;
  required: boolean;
  nullable: boolean | undefined;
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
  nullable: boolean | undefined;
  assignedIndex: number | number[];
}

export interface DictArrayParameter {
  name: string;
  type: ParameterTransform.PickSpread;
  dict: {
    [key: string]: ScalarParameter;
  };
}
export type QueryParameter =
  | ScalarParameter
  | ScalarArrayParameter
  | DictParameter
  | DictArrayParameter;

export interface InterpolatedQuery {
  query: string;
  mapping: QueryParameter[];
  bindings: Scalar[];
}

export interface NestedParameters {
  [subParamName: string]: Scalar;
}

export interface QueryParameters {
  [paramName: string]:
    | Scalar
    | NestedParameters
    | Scalar[]
    | NestedParameters[];
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
    const c = str.slice(interval.b + offset + 1, str.length);
    result = a + interval.sub + c;
    offset += result.length - str.length;
    str = result;
  }
  return result;
}
