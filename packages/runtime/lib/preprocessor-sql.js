import { assert, TransformType } from '@pgtyped/parser';
import { ParameterTransform, replaceIntervals, } from './preprocessor.js';
/* Processes query AST formed by new parser from pure SQL files */
export const processSQLQueryIR = (queryIR, passedParams) => {
    const bindings = [];
    const paramMapping = [];
    const usedParams = queryIR.params.filter((p) => p.name in queryIR.usedParamSet);
    let i = 1;
    const intervals = [];
    for (const usedParam of usedParams) {
        // Handle spread transform
        if (usedParam.transform.type === TransformType.ArraySpread) {
            let sub;
            if (passedParams) {
                const paramValue = passedParams[usedParam.name];
                sub = paramValue
                    .map((val) => {
                    bindings.push(val);
                    return `$${i++}`;
                })
                    .join(',');
            }
            else {
                const idx = i++;
                paramMapping.push({
                    name: usedParam.name,
                    type: ParameterTransform.Spread,
                    assignedIndex: idx,
                    required: usedParam.required,
                });
                sub = `$${idx}`;
            }
            usedParam.locs.forEach((loc) => intervals.push(Object.assign(Object.assign({}, loc), { sub: `(${sub})` })));
            continue;
        }
        // Handle pick transform
        if (usedParam.transform.type === TransformType.PickTuple) {
            const dict = {};
            const sub = usedParam.transform.keys
                .map(({ name, required }) => {
                const idx = i++;
                dict[name] = {
                    name,
                    required,
                    type: ParameterTransform.Scalar,
                    assignedIndex: idx,
                };
                if (passedParams) {
                    const paramValue = passedParams[usedParam.name];
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
            usedParam.locs.forEach((loc) => intervals.push(Object.assign(Object.assign({}, loc), { sub: `(${sub})` })));
            continue;
        }
        // Handle spreadPick transform
        if (usedParam.transform.type === TransformType.PickArraySpread) {
            let sub;
            if (passedParams) {
                const passedParam = passedParams[usedParam.name];
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
            }
            else {
                const dict = {};
                sub = usedParam.transform.keys
                    .map(({ name, required }) => {
                    const idx = i++;
                    dict[name] = {
                        name,
                        required,
                        type: ParameterTransform.Scalar,
                        assignedIndex: idx,
                    };
                    return `$${idx}`;
                })
                    .join(',');
                paramMapping.push({
                    name: usedParam.name,
                    type: ParameterTransform.PickSpread,
                    dict,
                });
            }
            usedParam.locs.forEach((loc) => intervals.push(Object.assign(Object.assign({}, loc), { sub: `(${sub})` })));
            continue;
        }
        // Handle scalar transform
        const assignedIndex = i++;
        if (passedParams) {
            const paramValue = passedParams[usedParam.name];
            bindings.push(paramValue);
        }
        else {
            paramMapping.push({
                name: usedParam.name,
                type: ParameterTransform.Scalar,
                assignedIndex,
                required: usedParam.required,
            });
        }
        usedParam.locs.forEach((loc) => intervals.push(Object.assign(Object.assign({}, loc), { sub: `$${assignedIndex}` })));
    }
    const flatStr = replaceIntervals(queryIR.statement, intervals);
    return {
        mapping: paramMapping,
        query: flatStr,
        bindings,
    };
};
//# sourceMappingURL=preprocessor-sql.js.map