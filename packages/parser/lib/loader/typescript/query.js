import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker.js';
import { QueryLexer } from './parser/QueryLexer.js';
import { QueryParser, } from './parser/QueryParser.js';
import { Logger } from '../sql/logger.js';
import { Interval } from 'antlr4ts/misc/index.js';
export var ParamType;
(function (ParamType) {
    ParamType["Scalar"] = "scalar";
    ParamType["Object"] = "object";
    ParamType["ScalarArray"] = "scalar_array";
    ParamType["ObjectArray"] = "object_array";
})(ParamType || (ParamType = {}));
export function assert(condition) {
    if (!condition) {
        throw new Error('Assertion Failed');
    }
}
class ParseListener {
    constructor(queryName, logger) {
        this.query = {};
        this.currentParam = {};
        this.currentSelection = {};
        this.query.name = queryName;
        this.logger = logger;
    }
    enterQuery(ctx) {
        const { inputStream } = ctx.start;
        const end = ctx.stop.stopIndex;
        const interval = new Interval(0, end);
        const text = inputStream.getText(interval);
        this.query = {
            name: this.query.name,
            text,
            params: [],
        };
    }
    enterParamName(ctx) {
        this.currentParam = {
            name: ctx.text,
            selection: undefined,
        };
    }
    enterScalarParamName(ctx) {
        const required = !!ctx.REQUIRED_MARK();
        const name = ctx.ID().text;
        this.currentParam = {
            name,
            required,
        };
    }
    exitParam(ctx) {
        const defLoc = {
            a: ctx.start.startIndex,
            b: ctx.stop.stopIndex,
            line: ctx.start.line,
            col: ctx.start.charPositionInLine,
        };
        this.currentParam.location = defLoc;
        this.currentParam.selection = this.currentSelection;
        this.query.params.push(this.currentParam);
        this.currentSelection = {};
        this.currentParam = {};
    }
    enterScalarParam() {
        this.currentSelection = {
            type: ParamType.Scalar,
        };
    }
    enterPickParam() {
        this.currentSelection = {
            type: ParamType.Object,
            keys: [],
        };
    }
    enterArrayPickParam() {
        this.currentSelection = {
            type: ParamType.ObjectArray,
            keys: [],
        };
    }
    enterArrayParam() {
        this.currentSelection = {
            type: ParamType.ScalarArray,
        };
    }
    enterPickKey(ctx) {
        assert('keys' in this.currentSelection);
        const required = !!ctx.REQUIRED_MARK();
        const name = ctx.ID().text;
        this.currentSelection.keys.push({ name, required });
    }
}
function parseText(text, queryName = 'query') {
    const logger = new Logger();
    const inputStream = CharStreams.fromString(text);
    const lexer = new QueryLexer(inputStream);
    lexer.removeErrorListeners();
    lexer.addErrorListener(logger);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new QueryParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(logger);
    const tree = parser.input();
    const listener = new ParseListener(queryName, logger);
    ParseTreeWalker.DEFAULT.walk(listener, tree);
    return {
        query: listener.query,
        events: logger.parseEvents,
    };
}
export default parseText;
//# sourceMappingURL=query.js.map