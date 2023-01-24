import { assert, SQLQueryIR, TransformType } from '@pgtyped/parser';
import {
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

/* Processes query AST formed by new parser from pure SQL files */
export const processSQLQueryIR = (
  queryIR: SQLQueryIR,
  passedParams?: QueryParameters,
): InterpolatedQuery => {
  const bindings: Scalar[] = [];
  const paramMapping: QueryParameter[] = [];
  const usedParams = queryIR.params.filter(
    (p) => p.name in queryIR.usedParamSet,
  );
  let i = 1;
  const intervals: { a: number; b: number; sub: string }[] = [];
  for (const usedParam of usedParams) {
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
          type: ParameterTransform.Spread,
          assignedIndex: idx,
          required: usedParam.required,
        } as ScalarArrayParameter);
        sub = `$${idx}`;
      }
      usedParam.locs.forEach((loc) =>
        intervals.push({
          ...loc,
          sub: `(${sub})`,
        }),
      );
      continue;
    }

    // Handle pick transform
    if (usedParam.transform.type === TransformType.PickTuple) {
      const dict: {
        [key: string]: ScalarParameter;
      } = {};
      const sub = usedParam.transform.keys
        .map(({ name, required }) => {
          const idx = i++;
          dict[name] = {
            name,
            required,
            type: ParameterTransform.Scalar,
            assignedIndex: idx,
          } as ScalarParameter;
          if (passedParams) {
            const paramValue = passedParams[usedParam.name] as NestedParameters;
            const val = paramValue[name];
            bindings.push(val);
          }
          return `$${idx}`;
        })
        .join(',');
      if (!passedParams) {
        paramMapping.push({
          name: usedParam.name,
          type: ParameterTransform.Pick,
          dict,
        });
      }

      usedParam.locs.forEach((loc) =>
        intervals.push({
          ...loc,
          sub: `(${sub})`,
        }),
      );
      continue;
    }

    // Handle spreadPick transform
    if (usedParam.transform.type === TransformType.PickArraySpread) {
      let sub: string;
      if (passedParams) {
        const passedParam = passedParams[usedParam.name] as NestedParameters[];
        sub = passedParam
          .map((entity) => {
            assert(usedParam.transform.type === TransformType.PickArraySpread);
            const ssub = usedParam.transform.keys
              .map(({ name }) => {
                const val = entity[name];
                bindings.push(val);
                return `$${i++}`;
              })
              .join(',');
            return ssub;
          })
          .join('),(');
      } else {
        const dict: {
          [key: string]: ScalarParameter;
        } = {};
        sub = usedParam.transform.keys
          .map(({ name, required }) => {
            const idx = i++;
            dict[name] = {
              name,
              required,
              type: ParameterTransform.Scalar,
              assignedIndex: idx,
            } as ScalarParameter;
            return `$${idx}`;
          })
          .join(',');
        paramMapping.push({
          name: usedParam.name,
          type: ParameterTransform.PickSpread,
          dict,
        });
      }

      usedParam.locs.forEach((loc) =>
        intervals.push({
          ...loc,
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
        type: ParameterTransform.Scalar,
        assignedIndex,
        required: usedParam.required,
      } as ScalarParameter);
    }

    usedParam.locs.forEach((loc) =>
      intervals.push({
        ...loc,
        sub: `$${assignedIndex}`,
      }),
    );
  }
  const flatStr = replaceIntervals(queryIR.statement, intervals);
  return {
    mapping: paramMapping,
    query: flatStr,
    bindings,
  };
};
