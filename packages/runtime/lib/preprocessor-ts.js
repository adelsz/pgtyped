import { assert } from '@pgtyped/parser';
import { ParamType } from '@pgtyped/parser';
import { ParameterTransform, replaceIntervals, } from './preprocessor.js';
function processScalar({ name, required }, nextIndex, existingConfig, parameters) {
    let index = nextIndex;
    const bindings = [];
    let replacement;
    let config = existingConfig;
    if (config) {
        replacement = `$${config.assignedIndex}`;
    }
    else {
        const assignedIndex = ++index;
        replacement = `$${assignedIndex}`;
        config = {
            assignedIndex,
            type: ParameterTransform.Scalar,
            name,
            required,
        };
        if (parameters) {
            const value = parameters[name];
            bindings.push(value);
        }
    }
    return { bindings, replacement, nextIndex: index, config };
}
function processScalarArray({ name, required }, nextIndex, existingConfig, parameters) {
    let index = nextIndex;
    const bindings = [];
    let config = existingConfig;
    let assignedIndex = [];
    if (config) {
        assignedIndex = config.assignedIndex;
    }
    else {
        if (parameters) {
            const values = parameters[name];
            assignedIndex = values.map((val) => {
                bindings.push(val);
                return ++index;
            });
        }
        else {
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
function processObject(paramName, keys, nextIndex, existingConfig, parameters) {
    let index = nextIndex;
    const bindings = [];
    const config = existingConfig ||
        {
            name: paramName,
            type: ParameterTransform.Pick,
            dict: {},
        };
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
            const value = parameters[paramName][name];
            bindings.push(value);
        }
        return `$${assignedIndex}`;
    });
    const replacement = '(' + keyIndices.join(', ') + ')';
    return { bindings, replacement, nextIndex: index, config };
}
function processObjectArray(paramName, keys, nextIndex, existingConfig, parameters) {
    let index = nextIndex;
    const bindings = [];
    const config = existingConfig ||
        {
            name: paramName,
            type: ParameterTransform.PickSpread,
            dict: {},
        };
    let replacement;
    if (parameters) {
        const values = parameters[paramName];
        if (values.length > 0) {
            replacement = values
                .map((val) => keys
                .map(({ name }) => {
                bindings.push(val[name]);
                return `$${++index}`;
            })
                .join(', '))
                .map((pk) => `(${pk})`)
                .join(', ');
        }
        else {
            // empty set for empty arrays
            replacement = '()';
        }
    }
    else {
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
export const processTSQueryAST = (query, parameters) => {
    const bindings = [];
    const baseMap = {};
    let i = 0;
    const intervals = [];
    for (const param of query.params) {
        let sub;
        let paramBindings = [];
        let config;
        let result;
        if (param.selection.type === ParamType.Scalar) {
            const prevConfig = baseMap[param.name];
            result = processScalar(param, i, prevConfig, parameters);
        }
        if (param.selection.type === ParamType.ScalarArray) {
            const prevConfig = baseMap[param.name];
            result = processScalarArray(param, i, prevConfig, parameters);
        }
        if (param.selection.type === ParamType.Object) {
            const prevConfig = baseMap[param.name] || {
                name: param.name,
                type: ParameterTransform.Pick,
                dict: {},
            };
            result = processObject(param.name, param.selection.keys, i, prevConfig, parameters);
        }
        if (param.selection.type === ParamType.ObjectArray) {
            const prevConfig = baseMap[param.name] || {
                name: param.name,
                type: ParameterTransform.PickSpread,
                dict: {},
            };
            result = processObjectArray(param.name, param.selection.keys, i, prevConfig, parameters);
        }
        assert(result);
        ({
            config,
            nextIndex: i,
            replacement: sub,
            bindings: paramBindings,
        } = result);
        baseMap[param.name] = config;
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
//# sourceMappingURL=preprocessor-ts.js.map