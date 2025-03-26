// Generated from src/loader/sql/grammar/SQLParser.g4 by ANTLR 4.9.0-SNAPSHOT
import { ATN } from "antlr4ts/atn/ATN.js";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer.js";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException.js";
import { Parser } from "antlr4ts/Parser.js";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator.js";
import { RecognitionException } from "antlr4ts/RecognitionException.js";
import { Token } from "antlr4ts/Token.js";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl.js";
import * as Utils from "antlr4ts/misc/Utils.js";
class SQLParser extends Parser {
    // @Override
    // @NotNull
    get vocabulary() {
        return SQLParser.VOCABULARY;
    }
    // tslint:enable:no-trailing-whitespace
    // @Override
    get grammarFileName() { return "SQLParser.g4"; }
    // @Override
    get ruleNames() { return SQLParser.ruleNames; }
    // @Override
    get serializedATN() { return SQLParser._serializedATN; }
    createFailedPredicateException(predicate, message) {
        return new FailedPredicateException(this, predicate, message);
    }
    constructor(input) {
        super(input);
        this._interp = new ParserATNSimulator(SQLParser._ATN, this);
    }
    // @RuleVersion(0)
    input() {
        let _localctx = new InputContext(this._ctx, this.state);
        this.enterRule(_localctx, 0, SQLParser.RULE_input);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 47;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                do {
                    {
                        {
                            this.state = 43;
                            this._errHandler.sync(this);
                            _alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
                            while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
                                if (_alt === 1) {
                                    {
                                        {
                                            this.state = 40;
                                            this.ignoredComment();
                                        }
                                    }
                                }
                                this.state = 45;
                                this._errHandler.sync(this);
                                _alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
                            }
                            this.state = 46;
                            this.query();
                        }
                    }
                    this.state = 49;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                } while (_la === SQLParser.OPEN_COMMENT);
                this.state = 51;
                this.match(SQLParser.EOF);
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
        this.enterRule(_localctx, 2, SQLParser.RULE_query);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 53;
                this.queryDef();
                this.state = 54;
                this.statement();
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
    queryDef() {
        let _localctx = new QueryDefContext(this._ctx, this.state);
        this.enterRule(_localctx, 4, SQLParser.RULE_queryDef);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 56;
                this.match(SQLParser.OPEN_COMMENT);
                this.state = 57;
                this.nameTag();
                this.state = 61;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === SQLParser.TYPE_TAG) {
                    {
                        {
                            this.state = 58;
                            this.paramTag();
                        }
                    }
                    this.state = 63;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 64;
                this.match(SQLParser.CLOSE_COMMENT);
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
    ignoredComment() {
        let _localctx = new IgnoredCommentContext(this._ctx, this.state);
        this.enterRule(_localctx, 6, SQLParser.RULE_ignoredComment);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 66;
                this.match(SQLParser.OPEN_COMMENT);
                this.state = 70;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SQLParser.ID) | (1 << SQLParser.LINE_COMMENT) | (1 << SQLParser.OPEN_COMMENT) | (1 << SQLParser.S_REQUIRED_MARK) | (1 << SQLParser.WORD) | (1 << SQLParser.EOF_STATEMENT) | (1 << SQLParser.WSL) | (1 << SQLParser.STRING) | (1 << SQLParser.DOLLAR_STRING) | (1 << SQLParser.PARAM_MARK) | (1 << SQLParser.WS) | (1 << SQLParser.TRANSFORM_ARROW) | (1 << SQLParser.SPREAD) | (1 << SQLParser.NAME_TAG) | (1 << SQLParser.TYPE_TAG) | (1 << SQLParser.OB) | (1 << SQLParser.CB) | (1 << SQLParser.COMMA) | (1 << SQLParser.C_REQUIRED_MARK) | (1 << SQLParser.ANY) | (1 << SQLParser.DOLLAR) | (1 << SQLParser.CAST))) !== 0)) {
                    {
                        {
                            this.state = 67;
                            _la = this._input.LA(1);
                            if (_la <= 0 || (_la === SQLParser.CLOSE_COMMENT)) {
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
                    this.state = 72;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 73;
                this.match(SQLParser.CLOSE_COMMENT);
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
    statement() {
        let _localctx = new StatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 8, SQLParser.RULE_statement);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 75;
                this.statementBody();
                this.state = 76;
                this.match(SQLParser.EOF_STATEMENT);
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
    statementBody() {
        let _localctx = new StatementBodyContext(this._ctx, this.state);
        this.enterRule(_localctx, 10, SQLParser.RULE_statementBody);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 85;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SQLParser.ID) | (1 << SQLParser.LINE_COMMENT) | (1 << SQLParser.OPEN_COMMENT) | (1 << SQLParser.S_REQUIRED_MARK) | (1 << SQLParser.WORD) | (1 << SQLParser.STRING) | (1 << SQLParser.DOLLAR_STRING) | (1 << SQLParser.PARAM_MARK))) !== 0)) {
                    {
                        this.state = 83;
                        this._errHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this._input, 4, this._ctx)) {
                            case 1:
                                {
                                    this.state = 78;
                                    this.match(SQLParser.LINE_COMMENT);
                                }
                                break;
                            case 2:
                                {
                                    this.state = 79;
                                    this.ignoredComment();
                                }
                                break;
                            case 3:
                                {
                                    this.state = 80;
                                    this.param();
                                }
                                break;
                            case 4:
                                {
                                    this.state = 81;
                                    this.word();
                                }
                                break;
                            case 5:
                                {
                                    this.state = 82;
                                    this.range();
                                }
                                break;
                        }
                    }
                    this.state = 87;
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
    word() {
        let _localctx = new WordContext(this._ctx, this.state);
        this.enterRule(_localctx, 12, SQLParser.RULE_word);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 88;
                _la = this._input.LA(1);
                if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << SQLParser.ID) | (1 << SQLParser.S_REQUIRED_MARK) | (1 << SQLParser.WORD) | (1 << SQLParser.STRING) | (1 << SQLParser.DOLLAR_STRING))) !== 0))) {
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
    range() {
        let _localctx = new RangeContext(this._ctx, this.state);
        this.enterRule(_localctx, 14, SQLParser.RULE_range);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 90;
                this.match(SQLParser.PARAM_MARK);
                this.state = 91;
                this.word();
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
        this.enterRule(_localctx, 16, SQLParser.RULE_param);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 93;
                this.match(SQLParser.PARAM_MARK);
                this.state = 94;
                this.paramId();
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
    paramId() {
        let _localctx = new ParamIdContext(this._ctx, this.state);
        this.enterRule(_localctx, 18, SQLParser.RULE_paramId);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 96;
                this.match(SQLParser.ID);
                this.state = 98;
                this._errHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this._input, 6, this._ctx)) {
                    case 1:
                        {
                            this.state = 97;
                            this.match(SQLParser.S_REQUIRED_MARK);
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
    nameTag() {
        let _localctx = new NameTagContext(this._ctx, this.state);
        this.enterRule(_localctx, 20, SQLParser.RULE_nameTag);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 100;
                this.match(SQLParser.NAME_TAG);
                this.state = 101;
                this.queryName();
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
    paramTag() {
        let _localctx = new ParamTagContext(this._ctx, this.state);
        this.enterRule(_localctx, 22, SQLParser.RULE_paramTag);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 103;
                this.match(SQLParser.TYPE_TAG);
                this.state = 104;
                this.paramName();
                this.state = 105;
                this.paramTransform();
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
    paramTransform() {
        let _localctx = new ParamTransformContext(this._ctx, this.state);
        this.enterRule(_localctx, 24, SQLParser.RULE_paramTransform);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 107;
                this.match(SQLParser.TRANSFORM_ARROW);
                this.state = 108;
                this.transformRule();
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
    transformRule() {
        let _localctx = new TransformRuleContext(this._ctx, this.state);
        this.enterRule(_localctx, 26, SQLParser.RULE_transformRule);
        try {
            this.state = 113;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 7, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 110;
                        this.spreadTransform();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 111;
                        this.pickTransform();
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 112;
                        this.spreadPickTransform();
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
    spreadTransform() {
        let _localctx = new SpreadTransformContext(this._ctx, this.state);
        this.enterRule(_localctx, 28, SQLParser.RULE_spreadTransform);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 115;
                this.match(SQLParser.OB);
                this.state = 116;
                this.match(SQLParser.SPREAD);
                this.state = 117;
                this.match(SQLParser.CB);
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
    pickTransform() {
        let _localctx = new PickTransformContext(this._ctx, this.state);
        this.enterRule(_localctx, 30, SQLParser.RULE_pickTransform);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 119;
                this.match(SQLParser.OB);
                this.state = 120;
                this.key();
                this.state = 125;
                this._errHandler.sync(this);
                _alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
                while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        {
                            {
                                this.state = 121;
                                this.match(SQLParser.COMMA);
                                this.state = 122;
                                this.key();
                            }
                        }
                    }
                    this.state = 127;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
                }
                this.state = 129;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === SQLParser.COMMA) {
                    {
                        this.state = 128;
                        this.match(SQLParser.COMMA);
                    }
                }
                this.state = 131;
                this.match(SQLParser.CB);
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
    spreadPickTransform() {
        let _localctx = new SpreadPickTransformContext(this._ctx, this.state);
        this.enterRule(_localctx, 32, SQLParser.RULE_spreadPickTransform);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 133;
                this.match(SQLParser.OB);
                this.state = 134;
                this.pickTransform();
                this.state = 135;
                this.match(SQLParser.SPREAD);
                this.state = 136;
                this.match(SQLParser.CB);
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
    key() {
        let _localctx = new KeyContext(this._ctx, this.state);
        this.enterRule(_localctx, 34, SQLParser.RULE_key);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 138;
                this.match(SQLParser.ID);
                this.state = 140;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === SQLParser.C_REQUIRED_MARK) {
                    {
                        this.state = 139;
                        this.match(SQLParser.C_REQUIRED_MARK);
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
    // @RuleVersion(0)
    queryName() {
        let _localctx = new QueryNameContext(this._ctx, this.state);
        this.enterRule(_localctx, 36, SQLParser.RULE_queryName);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 142;
                this.match(SQLParser.ID);
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
        this.enterRule(_localctx, 38, SQLParser.RULE_paramName);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 144;
                this.match(SQLParser.ID);
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
        if (!SQLParser.__ATN) {
            SQLParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(SQLParser._serializedATN));
        }
        return SQLParser.__ATN;
    }
}
SQLParser.ID = 1;
SQLParser.LINE_COMMENT = 2;
SQLParser.OPEN_COMMENT = 3;
SQLParser.S_REQUIRED_MARK = 4;
SQLParser.WORD = 5;
SQLParser.EOF_STATEMENT = 6;
SQLParser.WSL = 7;
SQLParser.STRING = 8;
SQLParser.DOLLAR_STRING = 9;
SQLParser.PARAM_MARK = 10;
SQLParser.WS = 11;
SQLParser.TRANSFORM_ARROW = 12;
SQLParser.SPREAD = 13;
SQLParser.NAME_TAG = 14;
SQLParser.TYPE_TAG = 15;
SQLParser.OB = 16;
SQLParser.CB = 17;
SQLParser.COMMA = 18;
SQLParser.C_REQUIRED_MARK = 19;
SQLParser.ANY = 20;
SQLParser.CLOSE_COMMENT = 21;
SQLParser.DOLLAR = 22;
SQLParser.CAST = 23;
SQLParser.RULE_input = 0;
SQLParser.RULE_query = 1;
SQLParser.RULE_queryDef = 2;
SQLParser.RULE_ignoredComment = 3;
SQLParser.RULE_statement = 4;
SQLParser.RULE_statementBody = 5;
SQLParser.RULE_word = 6;
SQLParser.RULE_range = 7;
SQLParser.RULE_param = 8;
SQLParser.RULE_paramId = 9;
SQLParser.RULE_nameTag = 10;
SQLParser.RULE_paramTag = 11;
SQLParser.RULE_paramTransform = 12;
SQLParser.RULE_transformRule = 13;
SQLParser.RULE_spreadTransform = 14;
SQLParser.RULE_pickTransform = 15;
SQLParser.RULE_spreadPickTransform = 16;
SQLParser.RULE_key = 17;
SQLParser.RULE_queryName = 18;
SQLParser.RULE_paramName = 19;
// tslint:disable:no-trailing-whitespace
SQLParser.ruleNames = [
    "input", "query", "queryDef", "ignoredComment", "statement", "statementBody",
    "word", "range", "param", "paramId", "nameTag", "paramTag", "paramTransform",
    "transformRule", "spreadTransform", "pickTransform", "spreadPickTransform",
    "key", "queryName", "paramName",
];
SQLParser._LITERAL_NAMES = [
    undefined, undefined, undefined, "'/*'", undefined, undefined, "';'",
    undefined, undefined, undefined, "':'", undefined, "'->'", "'...'", "'@name'",
    "'@param'", "'('", "')'", "','", undefined, undefined, "'*/'", "'$'",
    "'::'",
];
SQLParser._SYMBOLIC_NAMES = [
    undefined, "ID", "LINE_COMMENT", "OPEN_COMMENT", "S_REQUIRED_MARK", "WORD",
    "EOF_STATEMENT", "WSL", "STRING", "DOLLAR_STRING", "PARAM_MARK", "WS",
    "TRANSFORM_ARROW", "SPREAD", "NAME_TAG", "TYPE_TAG", "OB", "CB", "COMMA",
    "C_REQUIRED_MARK", "ANY", "CLOSE_COMMENT", "DOLLAR", "CAST",
];
SQLParser.VOCABULARY = new VocabularyImpl(SQLParser._LITERAL_NAMES, SQLParser._SYMBOLIC_NAMES, []);
SQLParser._serializedATN = "\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x19\x95\x04\x02" +
    "\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
    "\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
    "\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
    "\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x03\x02\x07\x02,\n\x02\f\x02\x0E" +
    "\x02/\v\x02\x03\x02\x06\x022\n\x02\r\x02\x0E\x023\x03\x02\x03\x02\x03" +
    "\x03\x03\x03\x03\x03\x03\x04\x03\x04\x03\x04\x07\x04>\n\x04\f\x04\x0E" +
    "\x04A\v\x04\x03\x04\x03\x04\x03\x05\x03\x05\x07\x05G\n\x05\f\x05\x0E\x05" +
    "J\v\x05\x03\x05\x03\x05\x03\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\x07" +
    "\x03\x07\x03\x07\x07\x07V\n\x07\f\x07\x0E\x07Y\v\x07\x03\b\x03\b\x03\t" +
    "\x03\t\x03\t\x03\n\x03\n\x03\n\x03\v\x03\v\x05\ve\n\v\x03\f\x03\f\x03" +
    "\f\x03\r\x03\r\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03" +
    "\x0F\x05\x0Ft\n\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x03\x11\x03\x11\x03" +
    "\x11\x03\x11\x07\x11~\n\x11\f\x11\x0E\x11\x81\v\x11\x03\x11\x05\x11\x84" +
    "\n\x11\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x13" +
    "\x03\x13\x05\x13\x8F\n\x13\x03\x14\x03\x14\x03\x15\x03\x15\x03\x15\x02" +
    "\x02\x02\x16\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02" +
    "\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02" +
    "&\x02(\x02\x02\x04\x03\x02\x17\x17\x05\x02\x03\x03\x06\x07\n\v\x02\x8F" +
    "\x021\x03\x02\x02\x02\x047\x03\x02\x02\x02\x06:\x03\x02\x02\x02\bD\x03" +
    "\x02\x02\x02\nM\x03\x02\x02\x02\fW\x03\x02\x02\x02\x0EZ\x03\x02\x02\x02" +
    "\x10\\\x03\x02\x02\x02\x12_\x03\x02\x02\x02\x14b\x03\x02\x02\x02\x16f" +
    "\x03\x02\x02\x02\x18i\x03\x02\x02\x02\x1Am\x03\x02\x02\x02\x1Cs\x03\x02" +
    "\x02\x02\x1Eu\x03\x02\x02\x02 y\x03\x02\x02\x02\"\x87\x03\x02\x02\x02" +
    "$\x8C\x03\x02\x02\x02&\x90\x03\x02\x02\x02(\x92\x03\x02\x02\x02*,\x05" +
    "\b\x05\x02+*\x03\x02\x02\x02,/\x03\x02\x02\x02-+\x03\x02\x02\x02-.\x03" +
    "\x02\x02\x02.0\x03\x02\x02\x02/-\x03\x02\x02\x0202\x05\x04\x03\x021-\x03" +
    "\x02\x02\x0223\x03\x02\x02\x0231\x03\x02\x02\x0234\x03\x02\x02\x0245\x03" +
    "\x02\x02\x0256\x07\x02\x02\x036\x03\x03\x02\x02\x0278\x05\x06\x04\x02" +
    "89\x05\n\x06\x029\x05\x03\x02\x02\x02:;\x07\x05\x02\x02;?\x05\x16\f\x02" +
    "<>\x05\x18\r\x02=<\x03\x02\x02\x02>A\x03\x02\x02\x02?=\x03\x02\x02\x02" +
    "?@\x03\x02\x02\x02@B\x03\x02\x02\x02A?\x03\x02\x02\x02BC\x07\x17\x02\x02" +
    "C\x07\x03\x02\x02\x02DH\x07\x05\x02\x02EG\n\x02\x02\x02FE\x03\x02\x02" +
    "\x02GJ\x03\x02\x02\x02HF\x03\x02\x02\x02HI\x03\x02\x02\x02IK\x03\x02\x02" +
    "\x02JH\x03\x02\x02\x02KL\x07\x17\x02\x02L\t\x03\x02\x02\x02MN\x05\f\x07" +
    "\x02NO\x07\b\x02\x02O\v\x03\x02\x02\x02PV\x07\x04\x02\x02QV\x05\b\x05" +
    "\x02RV\x05\x12\n\x02SV\x05\x0E\b\x02TV\x05\x10\t\x02UP\x03\x02\x02\x02" +
    "UQ\x03\x02\x02\x02UR\x03\x02\x02\x02US\x03\x02\x02\x02UT\x03\x02\x02\x02" +
    "VY\x03\x02\x02\x02WU\x03\x02\x02\x02WX\x03\x02\x02\x02X\r\x03\x02\x02" +
    "\x02YW\x03\x02\x02\x02Z[\t\x03\x02\x02[\x0F\x03\x02\x02\x02\\]\x07\f\x02" +
    "\x02]^\x05\x0E\b\x02^\x11\x03\x02\x02\x02_`\x07\f\x02\x02`a\x05\x14\v" +
    "\x02a\x13\x03\x02\x02\x02bd\x07\x03\x02\x02ce\x07\x06\x02\x02dc\x03\x02" +
    "\x02\x02de\x03\x02\x02\x02e\x15\x03\x02\x02\x02fg\x07\x10\x02\x02gh\x05" +
    "&\x14\x02h\x17\x03\x02\x02\x02ij\x07\x11\x02\x02jk\x05(\x15\x02kl\x05" +
    "\x1A\x0E\x02l\x19\x03\x02\x02\x02mn\x07\x0E\x02\x02no\x05\x1C\x0F\x02" +
    "o\x1B\x03\x02\x02\x02pt\x05\x1E\x10\x02qt\x05 \x11\x02rt\x05\"\x12\x02" +
    "sp\x03\x02\x02\x02sq\x03\x02\x02\x02sr\x03\x02\x02\x02t\x1D\x03\x02\x02" +
    "\x02uv\x07\x12\x02\x02vw\x07\x0F\x02\x02wx\x07\x13\x02\x02x\x1F\x03\x02" +
    "\x02\x02yz\x07\x12\x02\x02z\x7F\x05$\x13\x02{|\x07\x14\x02\x02|~\x05$" +
    "\x13\x02}{\x03\x02\x02\x02~\x81\x03\x02\x02\x02\x7F}\x03\x02\x02\x02\x7F" +
    "\x80\x03\x02\x02\x02\x80\x83\x03\x02\x02\x02\x81\x7F\x03\x02\x02\x02\x82" +
    "\x84\x07\x14\x02\x02\x83\x82\x03\x02\x02\x02\x83\x84\x03\x02\x02\x02\x84" +
    "\x85\x03\x02\x02\x02\x85\x86\x07\x13\x02\x02\x86!\x03\x02\x02\x02\x87" +
    "\x88\x07\x12\x02\x02\x88\x89\x05 \x11\x02\x89\x8A\x07\x0F\x02\x02\x8A" +
    "\x8B\x07\x13\x02\x02\x8B#\x03\x02\x02\x02\x8C\x8E\x07\x03\x02\x02\x8D" +
    "\x8F\x07\x15\x02\x02\x8E\x8D\x03\x02\x02\x02\x8E\x8F\x03\x02\x02\x02\x8F" +
    "%\x03\x02\x02\x02\x90\x91\x07\x03\x02\x02\x91\'\x03\x02\x02\x02\x92\x93" +
    "\x07\x03\x02\x02\x93)\x03\x02\x02\x02\r-3?HUWds\x7F\x83\x8E";
export { SQLParser };
export class InputContext extends ParserRuleContext {
    EOF() { return this.getToken(SQLParser.EOF, 0); }
    query(i) {
        if (i === undefined) {
            return this.getRuleContexts(QueryContext);
        }
        else {
            return this.getRuleContext(i, QueryContext);
        }
    }
    ignoredComment(i) {
        if (i === undefined) {
            return this.getRuleContexts(IgnoredCommentContext);
        }
        else {
            return this.getRuleContext(i, IgnoredCommentContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_input; }
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
    queryDef() {
        return this.getRuleContext(0, QueryDefContext);
    }
    statement() {
        return this.getRuleContext(0, StatementContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_query; }
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
export class QueryDefContext extends ParserRuleContext {
    OPEN_COMMENT() { return this.getToken(SQLParser.OPEN_COMMENT, 0); }
    nameTag() {
        return this.getRuleContext(0, NameTagContext);
    }
    CLOSE_COMMENT() { return this.getToken(SQLParser.CLOSE_COMMENT, 0); }
    paramTag(i) {
        if (i === undefined) {
            return this.getRuleContexts(ParamTagContext);
        }
        else {
            return this.getRuleContext(i, ParamTagContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_queryDef; }
    // @Override
    enterRule(listener) {
        if (listener.enterQueryDef) {
            listener.enterQueryDef(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitQueryDef) {
            listener.exitQueryDef(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitQueryDef) {
            return visitor.visitQueryDef(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class IgnoredCommentContext extends ParserRuleContext {
    OPEN_COMMENT() { return this.getToken(SQLParser.OPEN_COMMENT, 0); }
    CLOSE_COMMENT(i) {
        if (i === undefined) {
            return this.getTokens(SQLParser.CLOSE_COMMENT);
        }
        else {
            return this.getToken(SQLParser.CLOSE_COMMENT, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_ignoredComment; }
    // @Override
    enterRule(listener) {
        if (listener.enterIgnoredComment) {
            listener.enterIgnoredComment(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitIgnoredComment) {
            listener.exitIgnoredComment(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitIgnoredComment) {
            return visitor.visitIgnoredComment(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class StatementContext extends ParserRuleContext {
    statementBody() {
        return this.getRuleContext(0, StatementBodyContext);
    }
    EOF_STATEMENT() { return this.getToken(SQLParser.EOF_STATEMENT, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_statement; }
    // @Override
    enterRule(listener) {
        if (listener.enterStatement) {
            listener.enterStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStatement) {
            listener.exitStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class StatementBodyContext extends ParserRuleContext {
    LINE_COMMENT(i) {
        if (i === undefined) {
            return this.getTokens(SQLParser.LINE_COMMENT);
        }
        else {
            return this.getToken(SQLParser.LINE_COMMENT, i);
        }
    }
    ignoredComment(i) {
        if (i === undefined) {
            return this.getRuleContexts(IgnoredCommentContext);
        }
        else {
            return this.getRuleContext(i, IgnoredCommentContext);
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
    word(i) {
        if (i === undefined) {
            return this.getRuleContexts(WordContext);
        }
        else {
            return this.getRuleContext(i, WordContext);
        }
    }
    range(i) {
        if (i === undefined) {
            return this.getRuleContexts(RangeContext);
        }
        else {
            return this.getRuleContext(i, RangeContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_statementBody; }
    // @Override
    enterRule(listener) {
        if (listener.enterStatementBody) {
            listener.enterStatementBody(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStatementBody) {
            listener.exitStatementBody(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStatementBody) {
            return visitor.visitStatementBody(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class WordContext extends ParserRuleContext {
    WORD() { return this.tryGetToken(SQLParser.WORD, 0); }
    ID() { return this.tryGetToken(SQLParser.ID, 0); }
    STRING() { return this.tryGetToken(SQLParser.STRING, 0); }
    S_REQUIRED_MARK() { return this.tryGetToken(SQLParser.S_REQUIRED_MARK, 0); }
    DOLLAR_STRING() { return this.tryGetToken(SQLParser.DOLLAR_STRING, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_word; }
    // @Override
    enterRule(listener) {
        if (listener.enterWord) {
            listener.enterWord(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitWord) {
            listener.exitWord(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitWord) {
            return visitor.visitWord(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class RangeContext extends ParserRuleContext {
    PARAM_MARK() { return this.getToken(SQLParser.PARAM_MARK, 0); }
    word() {
        return this.getRuleContext(0, WordContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_range; }
    // @Override
    enterRule(listener) {
        if (listener.enterRange) {
            listener.enterRange(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRange) {
            listener.exitRange(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRange) {
            return visitor.visitRange(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParamContext extends ParserRuleContext {
    PARAM_MARK() { return this.getToken(SQLParser.PARAM_MARK, 0); }
    paramId() {
        return this.getRuleContext(0, ParamIdContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_param; }
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
export class ParamIdContext extends ParserRuleContext {
    ID() { return this.getToken(SQLParser.ID, 0); }
    S_REQUIRED_MARK() { return this.tryGetToken(SQLParser.S_REQUIRED_MARK, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_paramId; }
    // @Override
    enterRule(listener) {
        if (listener.enterParamId) {
            listener.enterParamId(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitParamId) {
            listener.exitParamId(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitParamId) {
            return visitor.visitParamId(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class NameTagContext extends ParserRuleContext {
    NAME_TAG() { return this.getToken(SQLParser.NAME_TAG, 0); }
    queryName() {
        return this.getRuleContext(0, QueryNameContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_nameTag; }
    // @Override
    enterRule(listener) {
        if (listener.enterNameTag) {
            listener.enterNameTag(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitNameTag) {
            listener.exitNameTag(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitNameTag) {
            return visitor.visitNameTag(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParamTagContext extends ParserRuleContext {
    TYPE_TAG() { return this.getToken(SQLParser.TYPE_TAG, 0); }
    paramName() {
        return this.getRuleContext(0, ParamNameContext);
    }
    paramTransform() {
        return this.getRuleContext(0, ParamTransformContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_paramTag; }
    // @Override
    enterRule(listener) {
        if (listener.enterParamTag) {
            listener.enterParamTag(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitParamTag) {
            listener.exitParamTag(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitParamTag) {
            return visitor.visitParamTag(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParamTransformContext extends ParserRuleContext {
    TRANSFORM_ARROW() { return this.getToken(SQLParser.TRANSFORM_ARROW, 0); }
    transformRule() {
        return this.getRuleContext(0, TransformRuleContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_paramTransform; }
    // @Override
    enterRule(listener) {
        if (listener.enterParamTransform) {
            listener.enterParamTransform(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitParamTransform) {
            listener.exitParamTransform(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitParamTransform) {
            return visitor.visitParamTransform(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class TransformRuleContext extends ParserRuleContext {
    spreadTransform() {
        return this.tryGetRuleContext(0, SpreadTransformContext);
    }
    pickTransform() {
        return this.tryGetRuleContext(0, PickTransformContext);
    }
    spreadPickTransform() {
        return this.tryGetRuleContext(0, SpreadPickTransformContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_transformRule; }
    // @Override
    enterRule(listener) {
        if (listener.enterTransformRule) {
            listener.enterTransformRule(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitTransformRule) {
            listener.exitTransformRule(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitTransformRule) {
            return visitor.visitTransformRule(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class SpreadTransformContext extends ParserRuleContext {
    OB() { return this.getToken(SQLParser.OB, 0); }
    SPREAD() { return this.getToken(SQLParser.SPREAD, 0); }
    CB() { return this.getToken(SQLParser.CB, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_spreadTransform; }
    // @Override
    enterRule(listener) {
        if (listener.enterSpreadTransform) {
            listener.enterSpreadTransform(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSpreadTransform) {
            listener.exitSpreadTransform(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSpreadTransform) {
            return visitor.visitSpreadTransform(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class PickTransformContext extends ParserRuleContext {
    OB() { return this.getToken(SQLParser.OB, 0); }
    key(i) {
        if (i === undefined) {
            return this.getRuleContexts(KeyContext);
        }
        else {
            return this.getRuleContext(i, KeyContext);
        }
    }
    CB() { return this.getToken(SQLParser.CB, 0); }
    COMMA(i) {
        if (i === undefined) {
            return this.getTokens(SQLParser.COMMA);
        }
        else {
            return this.getToken(SQLParser.COMMA, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_pickTransform; }
    // @Override
    enterRule(listener) {
        if (listener.enterPickTransform) {
            listener.enterPickTransform(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPickTransform) {
            listener.exitPickTransform(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPickTransform) {
            return visitor.visitPickTransform(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class SpreadPickTransformContext extends ParserRuleContext {
    OB() { return this.getToken(SQLParser.OB, 0); }
    pickTransform() {
        return this.getRuleContext(0, PickTransformContext);
    }
    SPREAD() { return this.getToken(SQLParser.SPREAD, 0); }
    CB() { return this.getToken(SQLParser.CB, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_spreadPickTransform; }
    // @Override
    enterRule(listener) {
        if (listener.enterSpreadPickTransform) {
            listener.enterSpreadPickTransform(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSpreadPickTransform) {
            listener.exitSpreadPickTransform(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSpreadPickTransform) {
            return visitor.visitSpreadPickTransform(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class KeyContext extends ParserRuleContext {
    ID() { return this.getToken(SQLParser.ID, 0); }
    C_REQUIRED_MARK() { return this.tryGetToken(SQLParser.C_REQUIRED_MARK, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_key; }
    // @Override
    enterRule(listener) {
        if (listener.enterKey) {
            listener.enterKey(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitKey) {
            listener.exitKey(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitKey) {
            return visitor.visitKey(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class QueryNameContext extends ParserRuleContext {
    ID() { return this.getToken(SQLParser.ID, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_queryName; }
    // @Override
    enterRule(listener) {
        if (listener.enterQueryName) {
            listener.enterQueryName(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitQueryName) {
            listener.exitQueryName(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitQueryName) {
            return visitor.visitQueryName(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParamNameContext extends ParserRuleContext {
    ID() { return this.getToken(SQLParser.ID, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return SQLParser.RULE_paramName; }
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
//# sourceMappingURL=SQLParser.js.map