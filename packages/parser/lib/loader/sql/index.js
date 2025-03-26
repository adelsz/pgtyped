import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker.js';
import { SQLLexer } from './parser/SQLLexer.js';
import { SQLParser, } from './parser/SQLParser.js';
import { Logger, ParseEventType, ParseWarningType, } from './logger.js';
import { Interval } from 'antlr4ts/misc/index.js';
export var TransformType;
(function (TransformType) {
    TransformType["Scalar"] = "scalar";
    TransformType["PickTuple"] = "pick_tuple";
    TransformType["ArraySpread"] = "array_spread";
    TransformType["PickArraySpread"] = "pick_array_spread";
})(TransformType || (TransformType = {}));
export function assert(condition) {
    if (!condition) {
        throw new Error('Assertion Failed');
    }
}
class ParseListener {
    constructor(logger) {
        this.parseTree = { queries: [] };
        this.currentQuery = {};
        this.currentParam = {};
        this.currentTransform = {};
        this.logger = logger;
    }
    exitQuery() {
        const currentQuery = this.currentQuery;
        currentQuery.params.forEach((p) => {
            const paramUsed = p.name in currentQuery.usedParamSet;
            if (!paramUsed) {
                this.logger.logEvent({
                    type: ParseEventType.Warning,
                    message: {
                        type: ParseWarningType.ParamNeverUsed,
                        text: `Parameter "${p.name}" is defined but never used`,
                    },
                    location: p.codeRefs.defined,
                });
            }
        });
        this.parseTree.queries.push(currentQuery);
    }
    enterQueryName(ctx) {
        this.currentQuery = {
            name: ctx.text,
            params: [],
            usedParamSet: {},
        };
    }
    enterParamName(ctx) {
        const defLoc = {
            a: ctx.start.startIndex,
            b: ctx.start.stopIndex,
            line: ctx.start.line,
            col: ctx.start.charPositionInLine,
        };
        this.currentParam = {
            name: ctx.text,
            codeRefs: {
                defined: defLoc,
                used: [],
            },
        };
    }
    exitParamTag() {
        assert(this.currentQuery.params);
        this.currentQuery.params.push(this.currentParam);
    }
    exitTransformRule() {
        this.currentParam.transform = this.currentTransform;
    }
    enterTransformRule() {
        this.currentTransform = {};
    }
    enterSpreadTransform() {
        this.currentTransform = {
            type: TransformType.ArraySpread,
        };
    }
    enterSpreadPickTransform() {
        this.currentTransform = {
            type: TransformType.PickArraySpread,
            keys: [],
        };
    }
    enterPickTransform() {
        if (this.currentTransform.type === TransformType.PickArraySpread) {
            return;
        }
        this.currentTransform = {
            type: TransformType.PickTuple,
            keys: [],
        };
    }
    enterKey(ctx) {
        assert('keys' in this.currentTransform && this.currentTransform.keys);
        const required = !!ctx.C_REQUIRED_MARK();
        const name = ctx.ID().text;
        this.currentTransform.keys.push({ name, required });
    }
    enterStatementBody(ctx) {
        var _a;
        const { inputStream } = ctx.start;
        assert(inputStream);
        const a = ctx.start.startIndex;
        const b = (_a = ctx.stop) === null || _a === void 0 ? void 0 : _a.stopIndex;
        assert(b);
        const interval = new Interval(a, b);
        const body = inputStream.getText(interval);
        const loc = {
            a,
            b,
            line: ctx.start.line,
            col: ctx.start.charPositionInLine,
        };
        this.currentQuery.statement = {
            body,
            loc,
        };
    }
    /** strip JS-like comments from SQL statements */
    exitIgnoredComment(ctx) {
        if (!this.currentQuery.statement) {
            return;
        }
        assert(this.currentQuery.statement);
        const statement = this.currentQuery.statement;
        const a = ctx.start.startIndex - statement.loc.a;
        const b = ctx.stop.stopIndex - statement.loc.a + 1;
        const body = statement.body;
        assert(b);
        const [partA, , partB] = [
            body.slice(0, a),
            body.slice(a, b),
            body.slice(b),
        ];
        const strippedStatement = partA + ' '.repeat(b - a) + partB;
        this.currentQuery.statement.body = strippedStatement;
    }
    enterParamId(ctx) {
        var _a, _b;
        assert(this.currentQuery.params);
        assert(this.currentQuery.usedParamSet);
        const paramName = ctx.ID().text;
        const required = !!ctx.S_REQUIRED_MARK();
        this.currentQuery.usedParamSet[paramName] = true;
        const reference = this.currentQuery.params.find((p) => p.name === paramName);
        const useLoc = {
            a: ctx.start.startIndex,
            b: (_b = (_a = ctx.stop) === null || _a === void 0 ? void 0 : _a.stopIndex) !== null && _b !== void 0 ? _b : ctx.start.stopIndex,
            line: ctx.start.line,
            col: ctx.start.charPositionInLine,
        };
        if (!reference) {
            this.currentQuery.params.push({
                name: paramName,
                required,
                transform: { type: TransformType.Scalar },
                codeRefs: {
                    used: [useLoc],
                },
            });
        }
        else {
            reference.required = reference.required || required;
            reference.codeRefs.used.push(useLoc);
        }
    }
}
function parseText(text) {
    const logger = new Logger();
    const inputStream = CharStreams.fromString(text);
    const lexer = new SQLLexer(inputStream);
    lexer.removeErrorListeners();
    lexer.addErrorListener(logger);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new SQLParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(logger);
    const tree = parser.input();
    const listener = new ParseListener(logger);
    ParseTreeWalker.DEFAULT.walk(listener, tree);
    return {
        queries: listener.parseTree.queries,
        events: logger.parseEvents,
    };
}
export function queryASTToIR(query) {
    const { a: statementStart } = query.statement.loc;
    return {
        usedParamSet: query.usedParamSet,
        params: query.params.map((param) => ({
            name: param.name,
            required: param.required,
            transform: param.transform,
            locs: param.codeRefs.used.map((codeRef) => ({
                a: codeRef.a - statementStart - 1,
                b: codeRef.b - statementStart,
            })),
        })),
        statement: query.statement.body,
    };
}
export { prettyPrintEvents } from './logger.js';
export default parseText;
//# sourceMappingURL=index.js.map