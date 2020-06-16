import { assert, Query as QueryAST, TransformType } from './loader/sql';

type Scalar = string | number | null;

export enum ParamTransform {
  Scalar,
  Spread,
  Pick,
  PickSpread,
}

interface IScalarParam {
  name: string;
  type: ParamTransform.Scalar;
  assignedIndex: number;
}

interface IDictParam {
  name: string;
  type: ParamTransform.Pick;
  dict: {
    [key: string]: IScalarParam;
  };
}

interface IScalarArrayParam {
  name: string;
  type: ParamTransform.Spread;
  assignedIndex: number;
}

interface IDictArrayParam {
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

interface INestedParameters {
  [subParamName: string]: Scalar;
}

export interface IQueryParameters {
  [paramName: string]:
    | Scalar
    | INestedParameters
    | Scalar[]
    | INestedParameters[];
}

function assertScalar(obj: any): obj is Scalar {
  return true;
}

function assertScalarArray(obj: any): obj is Scalar[] {
  return true;
}

function assertDictArray(obj: any): obj is INestedParameters[] {
  return true;
}

const rootRegex = /(\$\$?)(\w+)(?:\((.+?)\))?/gm;
const leafRegex = /(\w+)/gm;

enum Prefix {
  Singular = '$',
  Plural = '$$',
}

function replaceIntervals(
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

/* Processes query AST formed by new parser from pure SQL files */
export const processQueryAST = (
  query: QueryAST,
  passedParams?: IQueryParameters,
): IInterpolatedQuery => {
  const bindings: Scalar[] = [];
  const paramMapping: QueryParam[] = [];
  const usedParams = query.params.filter((p) => p.name in query.usedParamSet);
  const { a: statementStart } = query.statement.loc;
  let i = 1;
  const intervals: { a: number; b: number; sub: string }[] = [];
  for (const usedParam of usedParams) {
    const paramLocs = usedParam.codeRefs.used.map(({ a, b }) => ({
      a: a - statementStart - 1,
      b: b - statementStart,
    }));

    // Handle spread transform
    if (usedParam.transform.type === TransformType.ArraySpread) {
      let sub: string;
      if (passedParams) {
        const paramValue = passedParams[usedParam.name];
        sub = (paramValue as Scalar[])
          .map((val) => {
            bindings.push(val);
            return `$${i++}`;
          })
          .join(',');
      } else {
        const idx = i++;
        paramMapping.push({
          name: usedParam.name,
          type: ParamTransform.Spread,
          assignedIndex: idx,
        } as IScalarArrayParam);
        sub = `$${idx}`;
      }
      paramLocs.forEach((pl) =>
        intervals.push({
          ...pl,
          sub: `(${sub})`,
        }),
      );
      continue;
    }

    // Handle pick transform
    if (usedParam.transform.type === TransformType.PickTuple) {
      const dict: {
        [key: string]: IScalarParam;
      } = {};
      const sub = usedParam.transform.keys
        .map((pickKey) => {
          const idx = i++;
          dict[pickKey] = {
            name: pickKey,
            type: ParamTransform.Scalar,
            assignedIndex: idx,
          } as IScalarParam;
          if (passedParams) {
            const paramValue = passedParams[
              usedParam.name
            ] as INestedParameters;
            const val = paramValue[pickKey];
            bindings.push(val);
          }
          return `$${idx}`;
        })
        .join(',');
      if (!passedParams) {
        paramMapping.push({
          name: usedParam.name,
          type: ParamTransform.Pick,
          dict,
        });
      }

      paramLocs.forEach((pl) =>
        intervals.push({
          ...pl,
          sub: `(${sub})`,
        }),
      );
      continue;
    }

    // Handle spreadPick transform
    if (usedParam.transform.type === TransformType.PickArraySpread) {
      let sub: string;
      if (passedParams) {
        const passedParam = passedParams[usedParam.name] as INestedParameters[];
        sub = passedParam
          .map((entity) => {
            assert(usedParam.transform.type === TransformType.PickArraySpread);
            const ssub = usedParam.transform.keys
              .map((pickKey) => {
                const val = entity[pickKey];
                bindings.push(val);
                return `$${i++}`;
              })
              .join(',');
            return ssub;
          })
          .join('),(');
      } else {
        const dict: {
          [key: string]: IScalarParam;
        } = {};
        sub = usedParam.transform.keys
          .map((pickKey) => {
            const idx = i++;
            dict[pickKey] = {
              name: pickKey,
              type: ParamTransform.Scalar,
              assignedIndex: idx,
            } as IScalarParam;
            return `$${idx}`;
          })
          .join(',');
        paramMapping.push({
          name: usedParam.name,
          type: ParamTransform.PickSpread,
          dict,
        });
      }

      paramLocs.forEach((pl) =>
        intervals.push({
          ...pl,
          sub: `(${sub})`,
        }),
      );
      continue;
    }

    // Handle scalar transform
    const assignedIndex = i++;
    if (passedParams) {
      const paramValue = passedParams[usedParam.name] as Scalar;
      bindings.push(paramValue);
    } else {
      paramMapping.push({
        name: usedParam.name,
        type: ParamTransform.Scalar,
        assignedIndex,
      } as IScalarParam);
    }

    paramLocs.forEach((pl) =>
      intervals.push({
        ...pl,
        sub: `$${assignedIndex}`,
      }),
    );
  }
  const flatStr = replaceIntervals(query.statement.body, intervals);
  return {
    mapping: paramMapping,
    query: flatStr,
    bindings,
  };
};

/* Processes query strings produced by old parser from SQL-in-TS statements */
export const processQueryString = (
  query: string,
  parameters?: IQueryParameters,
): IInterpolatedQuery => {
  const bindings: Scalar[] = [];
  const params: QueryParam[] = [];
  let index = 0;
  const flatQuery = query.replace(
    rootRegex,
    (_1, prefix, paramName: string, nestedExp: string): string => {
      let param: QueryParam | undefined;
      let replacement = '$bad';
      if (prefix === Prefix.Singular) {
        if (nestedExp) {
          const dict: { [key: string]: IScalarParam } = {};
          const replacementContents = nestedExp.replace(
            leafRegex,
            (_2, leafParamName: string): string => {
              dict[leafParamName] = {
                type: ParamTransform.Scalar,
                name: leafParamName,
                assignedIndex: ++index,
              };
              return `$${index}`;
            },
          );
          replacement = `(${replacementContents})`;
          param = {
            type: ParamTransform.Pick,
            name: paramName,
            dict,
          };
        } else {
          const existingParam = params.find((p) => p.name === paramName);
          let assignedIndex;
          if (existingParam) {
            assert(existingParam?.type === ParamTransform.Scalar);
            assignedIndex = existingParam.assignedIndex;
          } else {
            assignedIndex = ++index;
            param = {
              type: ParamTransform.Scalar,
              name: paramName,
              assignedIndex,
            };

            if (parameters) {
              const scalar = parameters[paramName];
              if (assertScalar(scalar)) {
                bindings.push(scalar);
              } else {
                throw new Error(`Bad parameter ${paramName} expected scalar`);
              }
            }
          }
          replacement = `$${assignedIndex}`;
        }
      } else if (prefix === Prefix.Plural) {
        if (nestedExp) {
          const dict: any = {};
          const keys: string[] = [];
          nestedExp.replace(leafRegex, (_, key) => {
            keys.push(key);
            return '';
          });
          if (parameters) {
            const dictArray = parameters[paramName];
            if (assertDictArray(dictArray)) {
              replacement = dictArray
                .map((d) => {
                  const tupleStr = keys
                    .map((key) => {
                      const value = d[key];
                      bindings.push(value);
                      return `$${++index}`;
                    })
                    .join(', ');
                  return `(${tupleStr})`;
                })
                .join(', ');
            }
          } else {
            const repl = keys
              .map((key) => {
                const i = ++index;
                dict[key] = {
                  name: key,
                  assignedIndex: i,
                  type: ParamTransform.Scalar,
                };
                return `$${i}`;
              })
              .join(', ');
            param = {
              type: ParamTransform.PickSpread,
              name: paramName,
              dict,
            };
            replacement = `(${repl})`;
          }
        } else {
          if (parameters) {
            const scalars = parameters[paramName];
            if (assertScalarArray(scalars)) {
              replacement = scalars
                .map((value) => {
                  bindings.push(value);
                  return `$${++index}`;
                })
                .join(', ');
            } else {
              throw new Error(
                `Bad parameter ${paramName} expected array of scalars`,
              );
            }
          } else {
            param = {
              type: ParamTransform.Spread,
              name: paramName,
              assignedIndex: ++index,
            };
            replacement = `$${index}`;
          }
          replacement = `(${replacement})`;
        }
      }
      if (param) {
        params.push(param);
      }
      return replacement;
    },
  );

  return {
    mapping: parameters ? [] : params,
    query: flatQuery,
    bindings,
  };
};
