export var ParameterTransform;
(function (ParameterTransform) {
    ParameterTransform[ParameterTransform["Scalar"] = 0] = "Scalar";
    ParameterTransform[ParameterTransform["Spread"] = 1] = "Spread";
    ParameterTransform[ParameterTransform["Pick"] = 2] = "Pick";
    ParameterTransform[ParameterTransform["PickSpread"] = 3] = "PickSpread";
})(ParameterTransform || (ParameterTransform = {}));
export function replaceIntervals(str, intervals) {
    if (intervals.length === 0) {
        return str;
    }
    intervals.sort((x, y) => x.a - y.a);
    let offset = 0;
    let result = '';
    for (const interval of intervals) {
        const a = str.slice(0, interval.a + offset);
        const c = str.slice(interval.b + offset + 1, str.length);
        result = a + interval.sub + c;
        offset += result.length - str.length;
        str = result;
    }
    return result;
}
//# sourceMappingURL=preprocessor.js.map