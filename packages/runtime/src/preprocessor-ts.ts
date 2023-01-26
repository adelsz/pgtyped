import { TSQueryAST, assert } from '@pgtyped/parser';
import { Param, ParamKey, ParamType } from '@pgtyped/parser';
import {
  DictArrayParameter,
  DictParameter,
  InterpolatedQuery,
  NestedParameters,
  QueryParameters,
  ScalarArrayParameter,
  ScalarParameter,
  ParameterTransform,
  QueryParameter,
  replaceIntervals,
  Scalar,
} from './preprocessor.js';

function processScalar(
  { name, required }: Param,
  nextIndex: number,
  existingConfig?: ScalarParameter,
  parameters?: QueryParameters,
): {
  replacement: string;
  bindings: Scalar[];
  nextIndex: number;
  config: ScalarParameter;
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
    config = {
      assignedIndex,
      type: ParameterTransform.Scalar,
      name,
      required,
    };

    if (parameters) {
      const value = parameters[name] as Scalar;
      bindings.push(value);
    }
  }
  return { bindings, replacement, nextIndex: index, config };
}

function processScalarArray(
  { name, required }: Param,
  nextIndex: number,
  existingConfig?: ScalarArrayParameter,
  parameters?: QueryParameters,
): {
  replacement: string;
  bindings: Scalar[];
  nextIndex: number;
  config: ScalarArrayParameter;
} {
  let index = nextIndex;
  const bindings: Scalar[] = [];
  let config = existingConfig;

  let assignedIndex: number[] = [];
  if (config) {
    assignedIndex = config.assignedIndex as number[];
  } else {
    if (parameters) {
      const values = parameters[name] as Scalar[];
      assignedIndex = values.map((val) => {
        bindings.push(val);
        return ++index;
      });
    } else {
      assignedIndex = [++index];
    }
    config = {
      assignedIndex,
      type: ParameterTransform.Spread,
      name,
      required,
    };
  }
  const replacement = '(' + assignedIndex.map((v) => `$${v}`).join(', ') + ')';

  return { bindings, replacement, nextIndex: index, config };
}

function processObject(
  paramName: string,
  keys: ParamKey[],
  nextIndex: number,
  existingConfig?: DictParameter,
  parameters?: QueryParameters,
): {
  replacement: string;
  bindings: Scalar[];
  nextIndex: number;
  config: DictParameter;
} {
  let index = nextIndex;
  const bindings: Scalar[] = [];
  const config =
    existingConfig ||
    ({
      name: paramName,
      type: ParameterTransform.Pick,
      dict: {},
    } as DictParameter);

  const keyIndices = keys.map(({ name, required }) => {
    if (name in config.dict) {
      config.dict[name].required = config.dict[name].required || required;
      // reuse index if parameter was seen before
      return `$${config.dict[name].assignedIndex}`;
    }

    const assignedIndex = ++index;
    config.dict[name] = {
      assignedIndex,
      name,
      required,
      type: ParameterTransform.Scalar,
    };
    if (parameters) {
      const value = (parameters[paramName] as NestedParameters)[name];
      bindings.push(value);
    }
    return `$${assignedIndex}`;
  });
  const replacement = '(' + keyIndices.join(', ') + ')';

  return { bindings, replacement, nextIndex: index, config };
}

function processObjectArray(
  paramName: string,
  keys: ParamKey[],
  nextIndex: number,
  existingConfig?: DictArrayParameter,
  parameters?: QueryParameters,
): {
  replacement: string;
  bindings: Scalar[];
  nextIndex: number;
  config: DictArrayParameter;
} {
  let index = nextIndex;
  const bindings: Scalar[] = [];
  const config =
    existingConfig ||
    ({
      name: paramName,
      type: ParameterTransform.PickSpread,
      dict: {},
    } as DictArrayParameter);

  let replacement;
  if (parameters) {
    const values = parameters[paramName] as NestedParameters[];
    if (values.length > 0) {
      replacement = values
        .map((val) =>
          keys
            .map(({ name }) => {
              bindings.push(val[name]);
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
    const keyIndices = keys.map(({ name, required }) => {
      if (name in config.dict) {
        // reuse index if parameter was seen before
        return `$${config.dict[name].assignedIndex}`;
      }

      const assignedIndex = ++index;
      config.dict[name] = {
        assignedIndex,
        name,
        required,
        type: ParameterTransform.Scalar,
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
  parameters?: QueryParameters,
): InterpolatedQuery => {
  const bindings: Scalar[] = [];
  const baseMap: { [param: string]: QueryParameter } = {};
  let i = 0;
  const intervals: { a: number; b: number; sub: string }[] = [];
  for (const param of query.params) {
    let sub: string;
    let paramBindings: Scalar[] = [];
    let config: QueryParameter;
    let result;
    if (param.selection.type === ParamType.Scalar) {
      const prevConfig = baseMap[param.name] as ScalarParameter | undefined;
      result = processScalar(param, i, prevConfig, parameters);
    }
    if (param.selection.type === ParamType.ScalarArray) {
      const prevConfig = baseMap[param.name] as
        | ScalarArrayParameter
        | undefined;
      result = processScalarArray(param, i, prevConfig, parameters);
    }
    if (param.selection.type === ParamType.Object) {
      const prevConfig: DictParameter = (baseMap[
        param.name
      ] as DictParameter) || {
        name: param.name,
        type: ParameterTransform.Pick,
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
      const prevConfig: DictArrayParameter = (baseMap[
        param.name
      ] as DictArrayParameter) || {
        name: param.name,
        type: ParameterTransform.PickSpread,
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
