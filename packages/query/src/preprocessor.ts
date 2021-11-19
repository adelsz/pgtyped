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
  required: boolean;
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
  required: boolean;
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

/* Match query ending with where-in: "... <column> IN <:variable>" */
const IN_SPREAD = /\S+\s+in\s+(\S+)$/i

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
    const queryTillIntervalEnd = str.slice(0, interval.b + offset + 1);
    const restQueryAfterInterval = str.slice(interval.b + offset + 1, str.length);
    // support for ignoring empty WHERE IN
    if (interval.sub === '()' && queryTillIntervalEnd.match(IN_SPREAD) !== null) {
      result = queryTillIntervalEnd.replace(/\S+\s+in\s+(\S+)$/i, '1 = 1 /* empty $1 */') + restQueryAfterInterval
      continue;
    }
    const queryTillInterval = str.slice(0, interval.a + offset);
    result = queryTillInterval + interval.sub + restQueryAfterInterval;
    offset += result.length - str.length;
    str = result;
  }
  return result;
}
