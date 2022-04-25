import { assert, SQLQueryIR, TransformType } from './loader/sql';
import {
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

/* Processes query AST formed by new parser from pure SQL files */
export const processSQLQueryIR = (
  queryIR: SQLQueryIR,
  passedParams?: IQueryParameters,
): IInterpolatedQuery => {
  const bindings: Scalar[] = [];
  const paramMapping: QueryParam[] = [];
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
          type: ParamTransform.Spread,
          assignedIndex: idx,
          required: usedParam.required,
        } as IScalarArrayParam);
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
        [key: string]: IScalarParam;
      } = {};
      const sub = usedParam.transform.keys
        .map(({ name, required }) => {
          const idx = i++;
          dict[name] = {
            name,
            required,
            type: ParamTransform.Scalar,
            assignedIndex: idx,
          } as IScalarParam;
          if (passedParams) {
            const paramValue = passedParams[
              usedParam.name
            ] as INestedParameters;
            const val = paramValue[name];
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
        const passedParam = passedParams[usedParam.name] as INestedParameters[];
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
          [key: string]: IScalarParam;
        } = {};
        sub = usedParam.transform.keys
          .map(({ name, required }) => {
            const idx = i++;
            dict[name] = {
              name,
              required,
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
        type: ParamTransform.Scalar,
        assignedIndex,
        required: usedParam.required,
      } as IScalarParam);
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
