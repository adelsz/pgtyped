type ScalarType = string | number;

export enum ParamType {
  Scalar,
  Dict,
  ScalarArray,
  DictArray,
}

interface ScalarParam {
  name: string;
  type: ParamType.Scalar;
  assignedIndex: number;
}

interface DictParam {
  name: string;
  type: ParamType.Dict;
  dict: {
    [key: string]: ScalarParam;
  };
}

interface ScalarArrayParam {
  name: string;
  type: ParamType.ScalarArray;
  assignedIndex: number;
}

interface DictArrayParam {
  name: string;
  type: ParamType.DictArray;
  dict: {
    [key: string]: ScalarParam;
  };
}

export type QueryParam = ScalarParam | ScalarArrayParam | DictParam | DictArrayParam;

interface IInterpolatedQuery {
  query: string;
  mapping: Array<QueryParam>;
  bindings: Array<ScalarType>;
};

interface INestedParameters { [subParamName: string]: ScalarType };

interface IQueryParameters {
  [paramName: string]: ScalarType | INestedParameters | Array<ScalarType> | Array<INestedParameters>
}

function assertScalar(obj: any): obj is ScalarType {
  return true;
}

function assertScalarArray(obj: any): obj is Array<ScalarType> {
  return true;
}

function assertDictArray(obj: any): obj is Array<INestedParameters> {
  return true;
}

const rootRegex = /(\:\:?)([a-zA-Z0-9]+)(?:\((.+?)\))?/gm;
const leafRegex = /\:([a-zA-Z0-9]+)/gm;

const processQuery = (
  query: string,
  parameters?: IQueryParameters,
): IInterpolatedQuery => {
  const bindings: Array<ScalarType> = [];
  const params: Array<QueryParam> = [];
  let index = 0;
  const flatQuery = query.replace(
    rootRegex,
    (_, modifier, paramName: string, nestedExp: string): string => {
      let param: QueryParam | undefined;
      let replacement = '$bad';
      if (modifier === ':') {
        if (nestedExp) {
          const dict: { [key: string]: ScalarParam } = {};
          const replacementContents = nestedExp.replace(
            leafRegex,
            (_, leafParamName: string): string => {
              dict[leafParamName] = {
                type: ParamType.Scalar,
                name: leafParamName,
                assignedIndex: ++index,
              };
              return `$${index}`;
            }
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
      } else if (modifier === '::') {
        if (nestedExp) {
          const dict: any = {};
          const keys: string[] = [];
          nestedExp.replace(
            leafRegex,
            (_, key) => {
              keys.push(key);
              return '';
            }
          );
          if (parameters) {
            const dictArray = parameters[paramName];

            if (assertDictArray(dictArray)) {
              replacement = dictArray.map(dict => {
                const tupleStr = Object.values(dict).map(value => {
                  bindings.push(value);
                  return `$${++index}`;
                }).join(', ');
                return `(${tupleStr})`;
              }).join(', ');
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
            }).join(', ');
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
                .map(value => {
                  // TODO: bindings push
                  bindings.push(value);
                  return `$${++index}`;
                })
                .join(', ');
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
      if (param)
        params.push(param);
      return replacement;
    });

  return {
    mapping: params,
    query: flatQuery,
    bindings,
  };
};

export default processQuery;
