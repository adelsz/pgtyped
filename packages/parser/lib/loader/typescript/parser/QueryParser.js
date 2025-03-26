// Generated from src/loader/typescript/grammar/QueryParser.g4 by ANTLR 4.9.0-SNAPSHOT
import { ATN } from "antlr4ts/atn/ATN.js";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer.js";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException.js";
import { NoViableAltException } from "antlr4ts/NoViableAltException.js";
import { Parser } from "antlr4ts/Parser.js";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator.js";
import { RecognitionException } from "antlr4ts/RecognitionException.js";
import { Token } from "antlr4ts/Token.js";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl.js";
import * as Utils from "antlr4ts/misc/Utils.js";
class QueryParser extends Parser {
    // @Override
    // @NotNull
    get vocabulary() {
        return QueryParser.VOCABULARY;
    }
    // tslint:enable:no-trailing-whitespace
    // @Override
    get grammarFileName() { return "QueryParser.g4"; }
    // @Override
    get ruleNames() { return QueryParser.ruleNames; }
    // @Override
    get serializedATN() { return QueryParser._serializedATN; }
    createFailedPredicateException(predicate, message) {
        return new FailedPredicateException(this, predicate, message);
    }
    constructor(input) {
        super(input);
        this._interp = new ParserATNSimulator(QueryParser._ATN, this);
    }
    // @RuleVersion(0)
    input() {
        let _localctx = new InputContext(this._ctx, this.state);
        this.enterRule(_localctx, 0, QueryParser.RULE_input);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 22;
                this.query();
                this.state = 24;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === QueryParser.EOF_STATEMENT) {
                    {
                        this.state = 23;
                        this.match(QueryParser.EOF_STATEMENT);
                    }
                }
                this.state = 26;
                this.match(QueryParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    query() {
        let _localctx = new QueryContext(this._ctx, this.state);
        this.enterRule(_localctx, 2, QueryParser.RULE_query);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 29;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                do {
                    {
                        {
                            this.state = 28;
                            this.ignored();
                        }
                    }
                    this.state = 31;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QueryParser.ID) | (1 << QueryParser.COMMA) | (1 << QueryParser.OB) | (1 << QueryParser.CB) | (1 << QueryParser.WORD) | (1 << QueryParser.REQUIRED_MARK) | (1 << QueryParser.SPECIAL) | (1 << QueryParser.STRING))) !== 0));
                this.state = 42;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === QueryParser.SINGULAR_PARAM_MARK || _la === QueryParser.PLURAL_PARAM_MARK) {
                    {
                        {
                            this.state = 33;
                            this.param();
                            this.state = 37;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QueryParser.ID) | (1 << QueryParser.COMMA) | (1 << QueryParser.OB) | (1 << QueryParser.CB) | (1 << QueryParser.WORD) | (1 << QueryParser.REQUIRED_MARK) | (1 << QueryParser.SPECIAL) | (1 << QueryParser.STRING))) !== 0)) {
                                {
                                    {
                                        this.state = 34;
                                        this.ignored();
                                    }
                                }
                                this.state = 39;
                                this._errHandler.sync(this);
                                _la = this._input.LA(1);
                            }
                        }
                    }
                    this.state = 44;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    param() {
        let _localctx = new ParamContext(this._ctx, this.state);
        this.enterRule(_localctx, 4, QueryParser.RULE_param);
        try {
            this.state = 49;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 4, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 45;
                        this.pickParam();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 46;
                        this.arrayPickParam();
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 47;
                        this.scalarParam();
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 48;
                        this.arrayParam();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    ignored() {
        let _localctx = new IgnoredContext(this._ctx, this.state);
        this.enterRule(_localctx, 6, QueryParser.RULE_ignored);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 52;
                this._errHandler.sync(this);
                _alt = 1;
                do {
                    switch (_alt) {
                        case 1:
                            {
                                {
                                    this.state = 51;
                                    _la = this._input.LA(1);
                                    if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QueryParser.ID) | (1 << QueryParser.COMMA) | (1 << QueryParser.OB) | (1 << QueryParser.CB) | (1 << QueryParser.WORD) | (1 << QueryParser.REQUIRED_MARK) | (1 << QueryParser.SPECIAL) | (1 << QueryParser.STRING))) !== 0))) {
                                        this._errHandler.recoverInline(this);
                                    }
                                    else {
                                        if (this._input.LA(1) === Token.EOF) {
                                            this.matchedEOF = true;
                                        }
                                        this._errHandler.reportMatch(this);
                                        this.consume();
                                    }
                                }
                            }
                            break;
                        default:
                            throw new NoViableAltException(this);
                    }
                    this.state = 54;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 5, this._ctx);
                } while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    scalarParam() {
        let _localctx = new ScalarParamContext(this._ctx, this.state);
        this.enterRule(_localctx, 8, QueryParser.RULE_scalarParam);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 56;
                this.match(QueryParser.SINGULAR_PARAM_MARK);
                this.state = 57;
                this.scalarParamName();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    pickParam() {
        let _localctx = new PickParamContext(this._ctx, this.state);
        this.enterRule(_localctx, 10, QueryParser.RULE_pickParam);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 59;
                this.match(QueryParser.SINGULAR_PARAM_MARK);
                this.state = 60;
                this.paramName();
                this.state = 61;
                this.match(QueryParser.OB);
                this.state = 62;
                this.pickKey();
                this.state = 67;
                this._errHandler.sync(this);
                _alt = this.interpreter.adaptivePredict(this._input, 6, this._ctx);
                while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        {
                            {
                                this.state = 63;
                                this.match(QueryParser.COMMA);
                                this.state = 64;
                                this.pickKey();
                            }
                        }
                    }
                    this.state = 69;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 6, this._ctx);
                }
                this.state = 71;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === QueryParser.COMMA) {
                    {
                        this.state = 70;
                        this.match(QueryParser.COMMA);
                    }
                }
                this.state = 73;
                this.match(QueryParser.CB);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    arrayPickParam() {
        let _localctx = new ArrayPickParamContext(this._ctx, this.state);
        this.enterRule(_localctx, 12, QueryParser.RULE_arrayPickParam);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 75;
                this.match(QueryParser.PLURAL_PARAM_MARK);
                this.state = 76;
                this.paramName();
                this.state = 77;
                this.match(QueryParser.OB);
                this.state = 78;
                this.pickKey();
                this.state = 83;
                this._errHandler.sync(this);
                _alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
                while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        {
                            {
                                this.state = 79;
                                this.match(QueryParser.COMMA);
                                this.state = 80;
                                this.pickKey();
                            }
                        }
                    }
                    this.state = 85;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
                }
                this.state = 87;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === QueryParser.COMMA) {
                    {
                        this.state = 86;
                        this.match(QueryParser.COMMA);
                    }
                }
                this.state = 89;
                this.match(QueryParser.CB);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    arrayParam() {
        let _localctx = new ArrayParamContext(this._ctx, this.state);
        this.enterRule(_localctx, 14, QueryParser.RULE_arrayParam);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 91;
                this.match(QueryParser.PLURAL_PARAM_MARK);
                this.state = 92;
                this.scalarParamName();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    scalarParamName() {
        let _localctx = new ScalarParamNameContext(this._ctx, this.state);
        this.enterRule(_localctx, 16, QueryParser.RULE_scalarParamName);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 94;
                this.match(QueryParser.ID);
                this.state = 96;
                this._errHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this._input, 10, this._ctx)) {
                    case 1:
                        {
                            this.state = 95;
                            this.match(QueryParser.REQUIRED_MARK);
                        }
                        break;
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    paramName() {
        let _localctx = new ParamNameContext(this._ctx, this.state);
        this.enterRule(_localctx, 18, QueryParser.RULE_paramName);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 98;
                this.match(QueryParser.ID);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    pickKey() {
        let _localctx = new PickKeyContext(this._ctx, this.state);
        this.enterRule(_localctx, 20, QueryParser.RULE_pickKey);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 100;
                this.match(QueryParser.ID);
                this.state = 102;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === QueryParser.REQUIRED_MARK) {
                    {
                        this.state = 101;
                        this.match(QueryParser.REQUIRED_MARK);
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    static get _ATN() {
        if (!QueryParser.__ATN) {
            QueryParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(QueryParser._serializedATN));
        }
        return QueryParser.__ATN;
    }
}
QueryParser.ID = 1;
QueryParser.SINGULAR_PARAM_MARK = 2;
QueryParser.PLURAL_PARAM_MARK = 3;
QueryParser.COMMA = 4;
QueryParser.OB = 5;
QueryParser.CB = 6;
QueryParser.WORD = 7;
QueryParser.REQUIRED_MARK = 8;
QueryParser.SPECIAL = 9;
QueryParser.EOF_STATEMENT = 10;
QueryParser.WSL = 11;
QueryParser.STRING = 12;
QueryParser.RULE_input = 0;
QueryParser.RULE_query = 1;
QueryParser.RULE_param = 2;
QueryParser.RULE_ignored = 3;
QueryParser.RULE_scalarParam = 4;
QueryParser.RULE_pickParam = 5;
QueryParser.RULE_arrayPickParam = 6;
QueryParser.RULE_arrayParam = 7;
QueryParser.RULE_scalarParamName = 8;
QueryParser.RULE_paramName = 9;
QueryParser.RULE_pickKey = 10;
// tslint:disable:no-trailing-whitespace
QueryParser.ruleNames = [
    "input", "query", "param", "ignored", "scalarParam", "pickParam", "arrayPickParam",
    "arrayParam", "scalarParamName", "paramName", "pickKey",
];
QueryParser._LITERAL_NAMES = [
    undefined, undefined, "'$'", "'$$'", "','", "'('", "')'", undefined, "'!'",
    undefined, "';'",
];
QueryParser._SYMBOLIC_NAMES = [
    undefined, "ID", "SINGULAR_PARAM_MARK", "PLURAL_PARAM_MARK", "COMMA",
    "OB", "CB", "WORD", "REQUIRED_MARK", "SPECIAL", "EOF_STATEMENT", "WSL",
    "STRING",
];
QueryParser.VOCABULARY = new VocabularyImpl(QueryParser._LITERAL_NAMES, QueryParser._SYMBOLIC_NAMES, []);
QueryParser._serializedATN = "\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x0Ek\x04\x02" +
    "\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
    "\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x03\x02\x03\x02" +
    "\x05\x02\x1B\n\x02\x03\x02\x03\x02\x03\x03\x06\x03 \n\x03\r\x03\x0E\x03" +
    "!\x03\x03\x03\x03\x07\x03&\n\x03\f\x03\x0E\x03)\v\x03\x07\x03+\n\x03\f" +
    "\x03\x0E\x03.\v\x03\x03\x04\x03\x04\x03\x04\x03\x04\x05\x044\n\x04\x03" +
    "\x05\x06\x057\n\x05\r\x05\x0E\x058\x03\x06\x03\x06\x03\x06\x03\x07\x03" +
    "\x07\x03\x07\x03\x07\x03\x07\x03\x07\x07\x07D\n\x07\f\x07\x0E\x07G\v\x07" +
    "\x03\x07\x05\x07J\n\x07\x03\x07\x03\x07\x03\b\x03\b\x03\b\x03\b\x03\b" +
    "\x03\b\x07\bT\n\b\f\b\x0E\bW\v\b\x03\b\x05\bZ\n\b\x03\b\x03\b\x03\t\x03" +
    "\t\x03\t\x03\n\x03\n\x05\nc\n\n\x03\v\x03\v\x03\f\x03\f\x05\fi\n\f\x03" +
    "\f\x02\x02\x02\r\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10" +
    "\x02\x12\x02\x14\x02\x16\x02\x02\x03\x05\x02\x03\x03\x06\v\x0E\x0E\x02" +
    "m\x02\x18\x03\x02\x02\x02\x04\x1F\x03\x02\x02\x02\x063\x03\x02\x02\x02" +
    "\b6\x03\x02\x02\x02\n:\x03\x02\x02\x02\f=\x03\x02\x02\x02\x0EM\x03\x02" +
    "\x02\x02\x10]\x03\x02\x02\x02\x12`\x03\x02\x02\x02\x14d\x03\x02\x02\x02" +
    "\x16f\x03\x02\x02\x02\x18\x1A\x05\x04\x03\x02\x19\x1B\x07\f\x02\x02\x1A" +
    "\x19\x03\x02\x02\x02\x1A\x1B\x03\x02\x02\x02\x1B\x1C\x03\x02\x02\x02\x1C" +
    "\x1D\x07\x02\x02\x03\x1D\x03\x03\x02\x02\x02\x1E \x05\b\x05\x02\x1F\x1E" +
    "\x03\x02\x02\x02 !\x03\x02\x02\x02!\x1F\x03\x02\x02\x02!\"\x03\x02\x02" +
    "\x02\",\x03\x02\x02\x02#\'\x05\x06\x04\x02$&\x05\b\x05\x02%$\x03\x02\x02" +
    "\x02&)\x03\x02\x02\x02\'%\x03\x02\x02\x02\'(\x03\x02\x02\x02(+\x03\x02" +
    "\x02\x02)\'\x03\x02\x02\x02*#\x03\x02\x02\x02+.\x03\x02\x02\x02,*\x03" +
    "\x02\x02\x02,-\x03\x02\x02\x02-\x05\x03\x02\x02\x02.,\x03\x02\x02\x02" +
    "/4\x05\f\x07\x0204\x05\x0E\b\x0214\x05\n\x06\x0224\x05\x10\t\x023/\x03" +
    "\x02\x02\x0230\x03\x02\x02\x0231\x03\x02\x02\x0232\x03\x02\x02\x024\x07" +
    "\x03\x02\x02\x0257\t\x02\x02\x0265\x03\x02\x02\x0278\x03\x02\x02\x028" +
    "6\x03\x02\x02\x0289\x03\x02\x02\x029\t\x03\x02\x02\x02:;\x07\x04\x02\x02" +
    ";<\x05\x12\n\x02<\v\x03\x02\x02\x02=>\x07\x04\x02\x02>?\x05\x14\v\x02" +
    "?@\x07\x07\x02\x02@E\x05\x16\f\x02AB\x07\x06\x02\x02BD\x05\x16\f\x02C" +
    "A\x03\x02\x02\x02DG\x03\x02\x02\x02EC\x03\x02\x02\x02EF\x03\x02\x02\x02" +
    "FI\x03\x02\x02\x02GE\x03\x02\x02\x02HJ\x07\x06\x02\x02IH\x03\x02\x02\x02" +
    "IJ\x03\x02\x02\x02JK\x03\x02\x02\x02KL\x07\b\x02\x02L\r\x03\x02\x02\x02" +
    "MN\x07\x05\x02\x02NO\x05\x14\v\x02OP\x07\x07\x02\x02PU\x05\x16\f\x02Q" +
    "R\x07\x06\x02\x02RT\x05\x16\f\x02SQ\x03\x02\x02\x02TW\x03\x02\x02\x02" +
    "US\x03\x02\x02\x02UV\x03\x02\x02\x02VY\x03\x02\x02\x02WU\x03\x02\x02\x02" +
    "XZ\x07\x06\x02\x02YX\x03\x02\x02\x02YZ\x03\x02\x02\x02Z[\x03\x02\x02\x02" +
    "[\\\x07\b\x02\x02\\\x0F\x03\x02\x02\x02]^\x07\x05\x02\x02^_\x05\x12\n" +
    "\x02_\x11\x03\x02\x02\x02`b\x07\x03\x02\x02ac\x07\n\x02\x02ba\x03\x02" +
    "\x02\x02bc\x03\x02\x02\x02c\x13\x03\x02\x02\x02de\x07\x03\x02\x02e\x15" +
    "\x03\x02\x02\x02fh\x07\x03\x02\x02gi\x07\n\x02\x02hg\x03\x02\x02\x02h" +
    "i\x03\x02\x02\x02i\x17\x03\x02\x02\x02\x0E\x1A!\',38EIUYbh";
export { QueryParser };
export class InputContext extends ParserRuleContext {
    query() {
        return this.getRuleContext(0, QueryContext);
    }
    EOF() { return this.getToken(QueryParser.EOF, 0); }
    EOF_STATEMENT() { return this.tryGetToken(QueryParser.EOF_STATEMENT, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_input; }
    // @Override
    enterRule(listener) {
        if (listener.enterInput) {
            listener.enterInput(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitInput) {
            listener.exitInput(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitInput) {
            return visitor.visitInput(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class QueryContext extends ParserRuleContext {
    ignored(i) {
        if (i === undefined) {
            return this.getRuleContexts(IgnoredContext);
        }
        else {
            return this.getRuleContext(i, IgnoredContext);
        }
    }
    param(i) {
        if (i === undefined) {
            return this.getRuleContexts(ParamContext);
        }
        else {
            return this.getRuleContext(i, ParamContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_query; }
    // @Override
    enterRule(listener) {
        if (listener.enterQuery) {
            listener.enterQuery(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitQuery) {
            listener.exitQuery(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitQuery) {
            return visitor.visitQuery(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParamContext extends ParserRuleContext {
    pickParam() {
        return this.tryGetRuleContext(0, PickParamContext);
    }
    arrayPickParam() {
        return this.tryGetRuleContext(0, ArrayPickParamContext);
    }
    scalarParam() {
        return this.tryGetRuleContext(0, ScalarParamContext);
    }
    arrayParam() {
        return this.tryGetRuleContext(0, ArrayParamContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_param; }
    // @Override
    enterRule(listener) {
        if (listener.enterParam) {
            listener.enterParam(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitParam) {
            listener.exitParam(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitParam) {
            return visitor.visitParam(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class IgnoredContext extends ParserRuleContext {
    ID(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.ID);
        }
        else {
            return this.getToken(QueryParser.ID, i);
        }
    }
    WORD(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.WORD);
        }
        else {
            return this.getToken(QueryParser.WORD, i);
        }
    }
    STRING(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.STRING);
        }
        else {
            return this.getToken(QueryParser.STRING, i);
        }
    }
    COMMA(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.COMMA);
        }
        else {
            return this.getToken(QueryParser.COMMA, i);
        }
    }
    OB(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.OB);
        }
        else {
            return this.getToken(QueryParser.OB, i);
        }
    }
    CB(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.CB);
        }
        else {
            return this.getToken(QueryParser.CB, i);
        }
    }
    SPECIAL(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.SPECIAL);
        }
        else {
            return this.getToken(QueryParser.SPECIAL, i);
        }
    }
    REQUIRED_MARK(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.REQUIRED_MARK);
        }
        else {
            return this.getToken(QueryParser.REQUIRED_MARK, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_ignored; }
    // @Override
    enterRule(listener) {
        if (listener.enterIgnored) {
            listener.enterIgnored(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitIgnored) {
            listener.exitIgnored(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitIgnored) {
            return visitor.visitIgnored(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ScalarParamContext extends ParserRuleContext {
    SINGULAR_PARAM_MARK() { return this.getToken(QueryParser.SINGULAR_PARAM_MARK, 0); }
    scalarParamName() {
        return this.getRuleContext(0, ScalarParamNameContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_scalarParam; }
    // @Override
    enterRule(listener) {
        if (listener.enterScalarParam) {
            listener.enterScalarParam(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitScalarParam) {
            listener.exitScalarParam(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitScalarParam) {
            return visitor.visitScalarParam(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class PickParamContext extends ParserRuleContext {
    SINGULAR_PARAM_MARK() { return this.getToken(QueryParser.SINGULAR_PARAM_MARK, 0); }
    paramName() {
        return this.getRuleContext(0, ParamNameContext);
    }
    OB() { return this.getToken(QueryParser.OB, 0); }
    pickKey(i) {
        if (i === undefined) {
            return this.getRuleContexts(PickKeyContext);
        }
        else {
            return this.getRuleContext(i, PickKeyContext);
        }
    }
    CB() { return this.getToken(QueryParser.CB, 0); }
    COMMA(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.COMMA);
        }
        else {
            return this.getToken(QueryParser.COMMA, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_pickParam; }
    // @Override
    enterRule(listener) {
        if (listener.enterPickParam) {
            listener.enterPickParam(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPickParam) {
            listener.exitPickParam(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPickParam) {
            return visitor.visitPickParam(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ArrayPickParamContext extends ParserRuleContext {
    PLURAL_PARAM_MARK() { return this.getToken(QueryParser.PLURAL_PARAM_MARK, 0); }
    paramName() {
        return this.getRuleContext(0, ParamNameContext);
    }
    OB() { return this.getToken(QueryParser.OB, 0); }
    pickKey(i) {
        if (i === undefined) {
            return this.getRuleContexts(PickKeyContext);
        }
        else {
            return this.getRuleContext(i, PickKeyContext);
        }
    }
    CB() { return this.getToken(QueryParser.CB, 0); }
    COMMA(i) {
        if (i === undefined) {
            return this.getTokens(QueryParser.COMMA);
        }
        else {
            return this.getToken(QueryParser.COMMA, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_arrayPickParam; }
    // @Override
    enterRule(listener) {
        if (listener.enterArrayPickParam) {
            listener.enterArrayPickParam(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitArrayPickParam) {
            listener.exitArrayPickParam(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitArrayPickParam) {
            return visitor.visitArrayPickParam(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ArrayParamContext extends ParserRuleContext {
    PLURAL_PARAM_MARK() { return this.getToken(QueryParser.PLURAL_PARAM_MARK, 0); }
    scalarParamName() {
        return this.getRuleContext(0, ScalarParamNameContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_arrayParam; }
    // @Override
    enterRule(listener) {
        if (listener.enterArrayParam) {
            listener.enterArrayParam(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitArrayParam) {
            listener.exitArrayParam(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitArrayParam) {
            return visitor.visitArrayParam(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ScalarParamNameContext extends ParserRuleContext {
    ID() { return this.getToken(QueryParser.ID, 0); }
    REQUIRED_MARK() { return this.tryGetToken(QueryParser.REQUIRED_MARK, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_scalarParamName; }
    // @Override
    enterRule(listener) {
        if (listener.enterScalarParamName) {
            listener.enterScalarParamName(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitScalarParamName) {
            listener.exitScalarParamName(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitScalarParamName) {
            return visitor.visitScalarParamName(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParamNameContext extends ParserRuleContext {
    ID() { return this.getToken(QueryParser.ID, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_paramName; }
    // @Override
    enterRule(listener) {
        if (listener.enterParamName) {
            listener.enterParamName(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitParamName) {
            listener.exitParamName(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitParamName) {
            return visitor.visitParamName(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class PickKeyContext extends ParserRuleContext {
    ID() { return this.getToken(QueryParser.ID, 0); }
    REQUIRED_MARK() { return this.tryGetToken(QueryParser.REQUIRED_MARK, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return QueryParser.RULE_pickKey; }
    // @Override
    enterRule(listener) {
        if (listener.enterPickKey) {
            listener.enterPickKey(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPickKey) {
            listener.exitPickKey(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPickKey) {
            return visitor.visitPickKey(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
//# sourceMappingURL=QueryParser.js.map