import { TSQueryAST } from './loader/typescript';
import { ParamType } from './loader/typescript/query';
import { assert } from './loader/sql';
import {
  IDictArrayParam,
  IDictParam,
  IInterpolatedQuery,
  INestedParameters,
  IQueryParameters,
  IScalarArrayParam,
  IScalarParam,
  ParamTransform,
  QueryParam,
  replaceIntervals,
  Scalar,
} from './preprocessor';

function processScalar(
  paramName: string,
  nextIndex: number,
  existingConfig?: IScalarParam,
  parameters?: IQueryParameters,
): {
  replacement: string;
  bindings: Scalar[];
  nextIndex: number;
  config: IScalarParam;
} {
  let index = nextIndex;
  const bindings = [];
  let replacement;
  let config = existingConfig;
  if (config) {
    replacement = `$${config.assignedIndex}`;
  } else {
    const assignedIndex = ++index;
    replacement = `$${assignedIndex}`;
    config = { assignedIndex, type: ParamTransform.Scalar, name: paramName };

    if (parameters) {
      const value = parameters[paramName] as Scalar;
      bindings.push(value);
    }
  }
  return { bindings, replacement, nextIndex: index, config };
}

function processScalarArray(
  paramName: string,
  nextIndex: number,
  existingConfig?: IScalarArrayParam,
  parameters?: IQueryParameters,
): {
  replacement: string;
  bindings: Scalar[];
  nextIndex: number;
  config: IScalarArrayParam;
} {
  let index = nextIndex;
  const bindings: Scalar[] = [];
  let config = existingConfig;

  let assignedIndex: number[] = [];
  if (config) {
    assignedIndex = config.assignedIndex as number[];
  } else {
    if (parameters) {
      const values = parameters[paramName] as Scalar[];
      assignedIndex = values.map((val) => {
        bindings.push(val);
        return ++index;
      });
    } else {
      assignedIndex = [++index];
    }
    config = { assignedIndex, type: ParamTransform.Spread, name: paramName };
  }
  const replacement = '(' + assignedIndex.map((v) => `$${v}`).join(', ') + ')';

  return { bindings, replacement, nextIndex: index, config };
}

function processObject(
  paramName: string,
  keys: string[],
  nextIndex: number,
  existingConfig?: IDictParam,
  parameters?: IQueryParameters,
): {
  replacement: string;
  bindings: Scalar[];
  nextIndex: number;
  config: IDictParam;
} {
  let index = nextIndex;
  const bindings: Scalar[] = [];
  const config =
    existingConfig ||
    ({ name: paramName, type: ParamTransform.Pick, dict: {} } as IDictParam);

  const keyIndices = keys.map((key) => {
    if (key in config.dict) {
      // reuse index if parameter was seen before
      return `$${config.dict[key].assignedIndex}`;
    }

    const assignedIndex = ++index;
    config.dict[key] = {
      assignedIndex,
      type: ParamTransform.Scalar,
      name: key,
    };
    if (parameters) {
      const value = (parameters[paramName] as INestedParameters)[key];
      bindings.push(value);
    }
    return `$${assignedIndex}`;
  });
  const replacement = '(' + keyIndices.join(', ') + ')';

  return { bindings, replacement, nextIndex: index, config };
}

function processObjectArray(
  paramName: string,
  keys: string[],
  nextIndex: number,
  existingConfig?: IDictArrayParam,
  parameters?: IQueryParameters,
): {
  replacement: string;
  bindings: Scalar[];
  nextIndex: number;
  config: IDictArrayParam;
} {
  let index = nextIndex;
  const bindings: Scalar[] = [];
  const config =
    existingConfig ||
    ({
      name: paramName,
      type: ParamTransform.PickSpread,
      dict: {},
    } as IDictArrayParam);

  let replacement;
  if (parameters) {
    const values = parameters[paramName] as INestedParameters[];
    if (values.length > 0) {
      replacement = values
        .map((val) =>
          keys
            .map((key) => {
              bindings.push(val[key]);
              return `$${++index}`;
            })
            .join(', '),
        )
        .map((pk) => `(${pk})`)
        .join(', ');
    } else {
      // empty set for empty arrays
      replacement = '()';
    }
  } else {
    const keyIndices = keys.map((key) => {
      if (key in config.dict) {
        // reuse index if parameter was seen before
        return `$${config.dict[key].assignedIndex}`;
      }

      const assignedIndex = ++index;
      config.dict[key] = {
        assignedIndex,
        type: ParamTransform.Scalar,
        name: key,
      };
      return `$${assignedIndex}`;
    });
    replacement = '(' + keyIndices.join(', ') + ')';
  }

  return { bindings, replacement, nextIndex: index, config };
}

/* Processes query strings produced by old parser from SQL-in-TS statements */
export const processTSQueryAST = (
  query: TSQueryAST,
  parameters?: IQueryParameters,
): IInterpolatedQuery => {
  const bindings: Scalar[] = [];
  const baseMap: { [param: string]: QueryParam } = {};
  let i = 0;
  const intervals: { a: number; b: number; sub: string }[] = [];
  for (const param of query.params) {
    let sub: string;
    let paramBindings: Scalar[] = [];
    let config: QueryParam;
    let result;
    if (param.selection.type === ParamType.Scalar) {
      const prevConfig = baseMap[param.name] as IScalarParam | undefined;
      result = processScalar(param.name, i, prevConfig, parameters);
    }
    if (param.selection.type === ParamType.ScalarArray) {
      const prevConfig = baseMap[param.name] as IScalarArrayParam | undefined;
      result = processScalarArray(param.name, i, prevConfig, parameters);
    }
    if (param.selection.type === ParamType.Object) {
      const prevConfig: IDictParam = (baseMap[param.name] as IDictParam) || {
        name: param.name,
        type: ParamTransform.Pick,
        dict: {},
      };
      result = processObject(
        param.name,
        param.selection.keys,
        i,
        prevConfig,
        parameters,
      );
    }
    if (param.selection.type === ParamType.ObjectArray) {
      const prevConfig: IDictArrayParam = (baseMap[
        param.name
      ] as IDictArrayParam) || {
        name: param.name,
        type: ParamTransform.PickSpread,
        dict: {},
      };
      result = processObjectArray(
        param.name,
        param.selection.keys,
        i,
        prevConfig,
        parameters,
      );
    }
    assert(result);
    ({
      config,
      nextIndex: i,
      replacement: sub,
      bindings: paramBindings,
    } = result);
    baseMap[param.name] = config!;
    bindings.push(...paramBindings);
    intervals.push({ a: param.location.a, b: param.location.b, sub });
  }
  const flatStr = replaceIntervals(query.text, intervals);
  return {
    mapping: parameters ? [] : Object.values(baseMap),
    query: flatStr,
    bindings,
  };
};
