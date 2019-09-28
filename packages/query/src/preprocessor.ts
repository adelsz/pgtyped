type ScalarType = string | number | null;

export enum ParamType {
  Scalar,
  Dict,
  ScalarArray,
  DictArray,
}

interface IScalarParam {
  name: string;
  type: ParamType.Scalar;
  assignedIndex: number;
}

interface IDictParam {
  name: string;
  type: ParamType.Dict;
  dict: {
    [key: string]: IScalarParam;
  };
}

interface IScalarArrayParam {
  name: string;
  type: ParamType.ScalarArray;
  assignedIndex: number;
}

interface IDictArrayParam {
  name: string;
  type: ParamType.DictArray;
  dict: {
    [key: string]: IScalarParam;
  };
}

export type QueryParam = IScalarParam | IScalarArrayParam | IDictParam | IDictArrayParam;

interface IInterpolatedQuery {
  query: string;
  mapping: QueryParam[];
  bindings: ScalarType[];
}

interface INestedParameters { [subParamName: string]: ScalarType; }

export interface IQueryParameters {
  [paramName: string]: ScalarType | INestedParameters | ScalarType[] | INestedParameters[];
}

function assertScalar(obj: any): obj is ScalarType {
  return true;
}

function assertScalarArray(obj: any): obj is ScalarType[] {
  return true;
}

function assertDictArray(obj: any): obj is INestedParameters[] {
  return true;
}

const rootRegex = /(\$\$?)(\w+)(?:\((.+?)\))?/gm;
const leafRegex = /(\w+)/gm;

enum Prefix {
  Singular = "$",
  Plural = "$$",
}

const processQuery = (
  query: string,
  parameters?: IQueryParameters,
): IInterpolatedQuery => {
  const bindings: ScalarType[] = [];
  const params: QueryParam[] = [];
  let index = 0;
  const flatQuery = query.replace(
    rootRegex,
    (_1, prefix, paramName: string, nestedExp: string): string => {
      let param: QueryParam | undefined;
      let replacement = "$bad";
      if (prefix === Prefix.Singular) {
        if (nestedExp) {
          const dict: { [key: string]: IScalarParam } = {};
          const replacementContents = nestedExp.replace(
            leafRegex,
            (_2, leafParamName: string): string => {
              dict[leafParamName] = {
                type: ParamType.Scalar,
                name: leafParamName,
                assignedIndex: ++index,
              };
              return `$${index}`;
            },
          );
          replacement = `(${replacementContents})`;
          param = {
            type: ParamType.Dict,
            name: paramName,
            dict,
          };
        } else {
          if (parameters) {
            const scalar = parameters[paramName];
            if (assertScalar(scalar)) {
              bindings.push(scalar);
              index++;
            } else {
              throw new Error(`Bad parameter ${paramName} expected scalar`);
            }
          } else {
            param = {
              type: ParamType.Scalar,
              name: paramName,
              assignedIndex: ++index,
            };
          }
          replacement = `$${index}`;
        }
      } else if (prefix === Prefix.Plural) {
        if (nestedExp) {
          const dict: any = {};
          const keys: string[] = [];
          nestedExp.replace(
            leafRegex,
            (_, key) => {
              keys.push(key);
              return "";
            },
          );
          if (parameters) {
            const dictArray = parameters[paramName];
            if (assertDictArray(dictArray)) {
              replacement = dictArray.map(d => {
                const tupleStr = Object.values(d).map((value) => {
                  bindings.push(value);
                  return `$${++index}`;
                }).join(", ");
                return `(${tupleStr})`;
              }).join(", ");
            }
          } else {
            const repl = keys.map((key) => {
              const i = ++index;
              dict[key] = {
                name: key,
                assignedIndex: i,
                type: ParamType.Scalar,
              };
              return `$${i}`;
            }).join(", ");
            param = {
              type: ParamType.DictArray,
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
                  // TODO: bindings push
                  bindings.push(value);
                  return `$${++index}`;
                })
                .join(", ");
            } else {
              throw new Error(`Bad parameter ${paramName} expected array of scalars`);
            }
          } else {
            param = {
              type: ParamType.ScalarArray,
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
    });

  return {
    mapping: params,
    query: flatQuery,
    bindings,
  };
};

export default processQuery;
