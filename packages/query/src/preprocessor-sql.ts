import { assert, SQLQueryAST, TransformType } from './loader/sql';
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
export const processSQLQueryAST = (
  query: SQLQueryAST,
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
