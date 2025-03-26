import chalk from 'chalk';
export var ParseWarningType;
(function (ParseWarningType) {
    ParseWarningType[ParseWarningType["ParamNeverUsed"] = 0] = "ParamNeverUsed";
})(ParseWarningType || (ParseWarningType = {}));
var ParseErrorType;
(function (ParseErrorType) {
    ParseErrorType[ParseErrorType["ParseError"] = 0] = "ParseError";
})(ParseErrorType || (ParseErrorType = {}));
export var ParseEventType;
(function (ParseEventType) {
    ParseEventType[ParseEventType["Info"] = 0] = "Info";
    ParseEventType[ParseEventType["Warning"] = 1] = "Warning";
    ParseEventType[ParseEventType["Error"] = 2] = "Error";
})(ParseEventType || (ParseEventType = {}));
function styleIntervals(str, intervals) {
    if (intervals.length === 0) {
        return str;
    }
    intervals.sort((x, y) => x.a - y.a);
    let offset = 0;
    let colored = '';
    for (const interval of intervals) {
        const a = str.slice(0, interval.a + offset);
        const b = str.slice(interval.a + offset, interval.b + offset + 1);
        const c = str.slice(interval.b + offset + 1, str.length);
        colored = a + interval.style(b) + c;
        offset += colored.length - str.length;
        str = colored;
    }
    return colored;
}
export function prettyPrintEvents(text, parseEvents) {
    let msg = chalk.underline.magenta('Parsed file:\n');
    const errors = parseEvents.filter((e) => e.type === ParseEventType.Error);
    const warnings = parseEvents.filter((e) => e.type === ParseEventType.Warning);
    const lineStyle = {};
    const locsToColor = parseEvents
        .filter((w) => w.location)
        .map((w) => {
        var _a;
        const style = w.type === ParseEventType.Error
            ? chalk.underline.red
            : chalk.underline.yellow;
        if ((_a = w.location) === null || _a === void 0 ? void 0 : _a.line) {
            lineStyle[w.location.line] = style;
        }
        return Object.assign(Object.assign({}, w.location), { style });
    });
    const styledText = styleIntervals(text, locsToColor);
    let i = 1;
    const numberedText = styledText.replace(/^/gm, () => {
        const prefix = lineStyle[i] ? lineStyle[i]('>') : '|';
        return `${i++} ${prefix} `;
    });
    msg += numberedText;
    if (errors.length > 0) {
        msg += chalk.underline.red('\nErrors:\n');
        msg += errors
            .map((w) => { var _a, _b; return `- (${(_a = w.location) === null || _a === void 0 ? void 0 : _a.line}:${(_b = w.location) === null || _b === void 0 ? void 0 : _b.col}) ${w.message.text}`; })
            .join('\n');
    }
    if (warnings.length > 0) {
        msg += chalk.underline.yellow('\nWarnings:\n');
        msg += warnings
            .map((w) => { var _a, _b; return `- (${(_a = w.location) === null || _a === void 0 ? void 0 : _a.line}:${(_b = w.location) === null || _b === void 0 ? void 0 : _b.col}) ${w.message.text}`; })
            .join('\n');
    }
    // tslint:disable-next-line:no-console
    console.log(msg);
}
export class Logger {
    constructor() {
        this.parseEvents = [];
    }
    logEvent(event) {
        this.parseEvents.push(event);
    }
    syntaxError(_recognizer, symbol, line, col, msg, _e) {
        this.logEvent({
            type: ParseEventType.Error,
            critical: true,
            message: {
                type: ParseErrorType.ParseError,
                text: `Parse error: ${msg}`,
            },
            location: {
                a: symbol === null || symbol === void 0 ? void 0 : symbol.startIndex,
                b: symbol === null || symbol === void 0 ? void 0 : symbol.stopIndex,
                line,
                col,
            },
        });
    }
}
//# sourceMappingURL=logger.js.map