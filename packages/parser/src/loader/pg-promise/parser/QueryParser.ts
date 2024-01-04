// Generated from src/loader/pg-promise/grammar/QueryParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN.js";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer.js";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException.js";
import { NotNull } from "antlr4ts/Decorators.js";
import { NoViableAltException } from "antlr4ts/NoViableAltException.js";
import { Override } from "antlr4ts/Decorators.js";
import { Parser } from "antlr4ts/Parser.js";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator.js";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener.js";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor.js";
import { RecognitionException } from "antlr4ts/RecognitionException.js";
import { RuleContext } from "antlr4ts/RuleContext.js";
//import { RuleVersion } from "antlr4ts/RuleVersion.js";
import { TerminalNode } from "antlr4ts/tree/TerminalNode.js";
import { Token } from "antlr4ts/Token.js";
import { TokenStream } from "antlr4ts/TokenStream.js";
import { Vocabulary } from "antlr4ts/Vocabulary.js";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl.js";

import * as Utils from "antlr4ts/misc/Utils.js";

import { QueryParserListener } from "./QueryParserListener.js";
import { QueryParserVisitor } from "./QueryParserVisitor.js";


export class QueryParser extends Parser {
	public static readonly ID = 1;
	public static readonly INTEGER = 2;
	public static readonly PARAM_MARK = 3;
	public static readonly COMMA = 4;
	public static readonly OB = 5;
	public static readonly CB = 6;
	public static readonly NULLABILITY_MARK = 7;
	public static readonly FORMATTER_MARK = 8;
	public static readonly FORMATTER_SHORT = 9;
	public static readonly LINE_COMMENT = 10;
	public static readonly WORD = 11;
	public static readonly SPECIAL = 12;
	public static readonly EOF_STATEMENT = 13;
	public static readonly WSL = 14;
	public static readonly STRING = 15;
	public static readonly RULE_input = 0;
	public static readonly RULE_query = 1;
	public static readonly RULE_param = 2;
	public static readonly RULE_ignored = 3;
	public static readonly RULE_paramNamed = 4;
	public static readonly RULE_paramIndexed = 5;
	public static readonly RULE_formatter = 6;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"input", "query", "param", "ignored", "paramNamed", "paramIndexed", "formatter",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, "'$'", "','", "'('", "')'", "'/*nullable*/'", 
		"':'", undefined, undefined, undefined, undefined, "';'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "ID", "INTEGER", "PARAM_MARK", "COMMA", "OB", "CB", "NULLABILITY_MARK", 
		"FORMATTER_MARK", "FORMATTER_SHORT", "LINE_COMMENT", "WORD", "SPECIAL", 
		"EOF_STATEMENT", "WSL", "STRING",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(QueryParser._LITERAL_NAMES, QueryParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return QueryParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "QueryParser.g4"; }

	// @Override
	public get ruleNames(): string[] { return QueryParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return QueryParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(QueryParser._ATN, this);
	}
	// @RuleVersion(0)
	public input(): InputContext {
		let _localctx: InputContext = new InputContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, QueryParser.RULE_input);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 14;
			this.query();
			this.state = 16;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QueryParser.EOF_STATEMENT) {
				{
				this.state = 15;
				this.match(QueryParser.EOF_STATEMENT);
				}
			}

			this.state = 18;
			this.match(QueryParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public query(): QueryContext {
		let _localctx: QueryContext = new QueryContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, QueryParser.RULE_query);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 21;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 20;
				this.ignored();
				}
				}
				this.state = 23;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QueryParser.ID) | (1 << QueryParser.INTEGER) | (1 << QueryParser.COMMA) | (1 << QueryParser.OB) | (1 << QueryParser.CB) | (1 << QueryParser.FORMATTER_MARK) | (1 << QueryParser.FORMATTER_SHORT) | (1 << QueryParser.LINE_COMMENT) | (1 << QueryParser.WORD) | (1 << QueryParser.SPECIAL) | (1 << QueryParser.STRING))) !== 0));
			this.state = 34;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === QueryParser.PARAM_MARK) {
				{
				{
				this.state = 25;
				this.param();
				this.state = 29;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QueryParser.ID) | (1 << QueryParser.INTEGER) | (1 << QueryParser.COMMA) | (1 << QueryParser.OB) | (1 << QueryParser.CB) | (1 << QueryParser.FORMATTER_MARK) | (1 << QueryParser.FORMATTER_SHORT) | (1 << QueryParser.LINE_COMMENT) | (1 << QueryParser.WORD) | (1 << QueryParser.SPECIAL) | (1 << QueryParser.STRING))) !== 0)) {
					{
					{
					this.state = 26;
					this.ignored();
					}
					}
					this.state = 31;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				}
				this.state = 36;
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
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public param(): ParamContext {
		let _localctx: ParamContext = new ParamContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, QueryParser.RULE_param);
		try {
			this.state = 39;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 37;
				this.paramIndexed();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 38;
				this.paramNamed();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public ignored(): IgnoredContext {
		let _localctx: IgnoredContext = new IgnoredContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, QueryParser.RULE_ignored);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 42;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 41;
					_la = this._input.LA(1);
					if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QueryParser.ID) | (1 << QueryParser.INTEGER) | (1 << QueryParser.COMMA) | (1 << QueryParser.OB) | (1 << QueryParser.CB) | (1 << QueryParser.FORMATTER_MARK) | (1 << QueryParser.FORMATTER_SHORT) | (1 << QueryParser.LINE_COMMENT) | (1 << QueryParser.WORD) | (1 << QueryParser.SPECIAL) | (1 << QueryParser.STRING))) !== 0))) {
					this._errHandler.recoverInline(this);
					} else {
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
				this.state = 44;
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
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public paramNamed(): ParamNamedContext {
		let _localctx: ParamNamedContext = new ParamNamedContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, QueryParser.RULE_paramNamed);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 46;
			this.match(QueryParser.PARAM_MARK);
			this.state = 47;
			this.match(QueryParser.OB);
			this.state = 48;
			this.match(QueryParser.ID);
			this.state = 50;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QueryParser.FORMATTER_MARK || _la === QueryParser.FORMATTER_SHORT) {
				{
				this.state = 49;
				this.formatter();
				}
			}

			this.state = 52;
			this.match(QueryParser.CB);
			this.state = 54;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QueryParser.NULLABILITY_MARK) {
				{
				this.state = 53;
				this.match(QueryParser.NULLABILITY_MARK);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public paramIndexed(): ParamIndexedContext {
		let _localctx: ParamIndexedContext = new ParamIndexedContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, QueryParser.RULE_paramIndexed);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 56;
			this.match(QueryParser.PARAM_MARK);
			this.state = 57;
			this.match(QueryParser.INTEGER);
			this.state = 59;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				{
				this.state = 58;
				this.formatter();
				}
				break;
			}
			this.state = 62;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QueryParser.NULLABILITY_MARK) {
				{
				this.state = 61;
				this.match(QueryParser.NULLABILITY_MARK);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public formatter(): FormatterContext {
		let _localctx: FormatterContext = new FormatterContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, QueryParser.RULE_formatter);
		try {
			this.state = 67;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case QueryParser.FORMATTER_MARK:
				this.enterOuterAlt(_localctx, 1);
				{
				{
				this.state = 64;
				this.match(QueryParser.FORMATTER_MARK);
				this.state = 65;
				this.match(QueryParser.ID);
				}
				}
				break;
			case QueryParser.FORMATTER_SHORT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 66;
				this.match(QueryParser.FORMATTER_SHORT);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x11H\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x03\x02\x03\x02\x05\x02\x13\n\x02\x03\x02\x03\x02\x03" +
		"\x03\x06\x03\x18\n\x03\r\x03\x0E\x03\x19\x03\x03\x03\x03\x07\x03\x1E\n" +
		"\x03\f\x03\x0E\x03!\v\x03\x07\x03#\n\x03\f\x03\x0E\x03&\v\x03\x03\x04" +
		"\x03\x04\x05\x04*\n\x04\x03\x05\x06\x05-\n\x05\r\x05\x0E\x05.\x03\x06" +
		"\x03\x06\x03\x06\x03\x06\x05\x065\n\x06\x03\x06\x03\x06\x05\x069\n\x06" +
		"\x03\x07\x03\x07\x03\x07\x05\x07>\n\x07\x03\x07\x05\x07A\n\x07\x03\b\x03" +
		"\b\x03\b\x05\bF\n\b\x03\b\x02\x02\x02\t\x02\x02\x04\x02\x06\x02\b\x02" +
		"\n\x02\f\x02\x0E\x02\x02\x03\x06\x02\x03\x04\x06\b\n\x0E\x11\x11\x02K" +
		"\x02\x10\x03\x02\x02\x02\x04\x17\x03\x02\x02\x02\x06)\x03\x02\x02\x02" +
		"\b,\x03\x02\x02\x02\n0\x03\x02\x02\x02\f:\x03\x02\x02\x02\x0EE\x03\x02" +
		"\x02\x02\x10\x12\x05\x04\x03\x02\x11\x13\x07\x0F\x02\x02\x12\x11\x03\x02" +
		"\x02\x02\x12\x13\x03\x02\x02\x02\x13\x14\x03\x02\x02\x02\x14\x15\x07\x02" +
		"\x02\x03\x15\x03\x03\x02\x02\x02\x16\x18\x05\b\x05\x02\x17\x16\x03\x02" +
		"\x02\x02\x18\x19\x03\x02\x02\x02\x19\x17\x03\x02\x02\x02\x19\x1A\x03\x02" +
		"\x02\x02\x1A$\x03\x02\x02\x02\x1B\x1F\x05\x06\x04\x02\x1C\x1E\x05\b\x05" +
		"\x02\x1D\x1C\x03\x02\x02\x02\x1E!\x03\x02\x02\x02\x1F\x1D\x03\x02\x02" +
		"\x02\x1F \x03\x02\x02\x02 #\x03\x02\x02\x02!\x1F\x03\x02\x02\x02\"\x1B" +
		"\x03\x02\x02\x02#&\x03\x02\x02\x02$\"\x03\x02\x02\x02$%\x03\x02\x02\x02" +
		"%\x05\x03\x02\x02\x02&$\x03\x02\x02\x02\'*\x05\f\x07\x02(*\x05\n\x06\x02" +
		")\'\x03\x02\x02\x02)(\x03\x02\x02\x02*\x07\x03\x02\x02\x02+-\t\x02\x02" +
		"\x02,+\x03\x02\x02\x02-.\x03\x02\x02\x02.,\x03\x02\x02\x02./\x03\x02\x02" +
		"\x02/\t\x03\x02\x02\x0201\x07\x05\x02\x0212\x07\x07\x02\x0224\x07\x03" +
		"\x02\x0235\x05\x0E\b\x0243\x03\x02\x02\x0245\x03\x02\x02\x0256\x03\x02" +
		"\x02\x0268\x07\b\x02\x0279\x07\t\x02\x0287\x03\x02\x02\x0289\x03\x02\x02" +
		"\x029\v\x03\x02\x02\x02:;\x07\x05\x02\x02;=\x07\x04\x02\x02<>\x05\x0E" +
		"\b\x02=<\x03\x02\x02\x02=>\x03\x02\x02\x02>@\x03\x02\x02\x02?A\x07\t\x02" +
		"\x02@?\x03\x02\x02\x02@A\x03\x02\x02\x02A\r\x03\x02\x02\x02BC\x07\n\x02" +
		"\x02CF\x07\x03\x02\x02DF\x07\v\x02\x02EB\x03\x02\x02\x02ED\x03\x02\x02" +
		"\x02F\x0F\x03\x02\x02\x02\r\x12\x19\x1F$).48=@E";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!QueryParser.__ATN) {
			QueryParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(QueryParser._serializedATN));
		}

		return QueryParser.__ATN;
	}

}

export class InputContext extends ParserRuleContext {
	public query(): QueryContext {
		return this.getRuleContext(0, QueryContext);
	}
	public EOF(): TerminalNode { return this.getToken(QueryParser.EOF, 0); }
	public EOF_STATEMENT(): TerminalNode | undefined { return this.tryGetToken(QueryParser.EOF_STATEMENT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_input; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterInput) {
			listener.enterInput(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitInput) {
			listener.exitInput(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitInput) {
			return visitor.visitInput(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QueryContext extends ParserRuleContext {
	public ignored(): IgnoredContext[];
	public ignored(i: number): IgnoredContext;
	public ignored(i?: number): IgnoredContext | IgnoredContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IgnoredContext);
		} else {
			return this.getRuleContext(i, IgnoredContext);
		}
	}
	public param(): ParamContext[];
	public param(i: number): ParamContext;
	public param(i?: number): ParamContext | ParamContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParamContext);
		} else {
			return this.getRuleContext(i, ParamContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_query; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterQuery) {
			listener.enterQuery(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitQuery) {
			listener.exitQuery(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitQuery) {
			return visitor.visitQuery(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParamContext extends ParserRuleContext {
	public paramIndexed(): ParamIndexedContext | undefined {
		return this.tryGetRuleContext(0, ParamIndexedContext);
	}
	public paramNamed(): ParamNamedContext | undefined {
		return this.tryGetRuleContext(0, ParamNamedContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_param; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterParam) {
			listener.enterParam(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitParam) {
			listener.exitParam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitParam) {
			return visitor.visitParam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IgnoredContext extends ParserRuleContext {
	public LINE_COMMENT(): TerminalNode[];
	public LINE_COMMENT(i: number): TerminalNode;
	public LINE_COMMENT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.LINE_COMMENT);
		} else {
			return this.getToken(QueryParser.LINE_COMMENT, i);
		}
	}
	public ID(): TerminalNode[];
	public ID(i: number): TerminalNode;
	public ID(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.ID);
		} else {
			return this.getToken(QueryParser.ID, i);
		}
	}
	public FORMATTER_MARK(): TerminalNode[];
	public FORMATTER_MARK(i: number): TerminalNode;
	public FORMATTER_MARK(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.FORMATTER_MARK);
		} else {
			return this.getToken(QueryParser.FORMATTER_MARK, i);
		}
	}
	public FORMATTER_SHORT(): TerminalNode[];
	public FORMATTER_SHORT(i: number): TerminalNode;
	public FORMATTER_SHORT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.FORMATTER_SHORT);
		} else {
			return this.getToken(QueryParser.FORMATTER_SHORT, i);
		}
	}
	public INTEGER(): TerminalNode[];
	public INTEGER(i: number): TerminalNode;
	public INTEGER(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.INTEGER);
		} else {
			return this.getToken(QueryParser.INTEGER, i);
		}
	}
	public WORD(): TerminalNode[];
	public WORD(i: number): TerminalNode;
	public WORD(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.WORD);
		} else {
			return this.getToken(QueryParser.WORD, i);
		}
	}
	public STRING(): TerminalNode[];
	public STRING(i: number): TerminalNode;
	public STRING(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.STRING);
		} else {
			return this.getToken(QueryParser.STRING, i);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.COMMA);
		} else {
			return this.getToken(QueryParser.COMMA, i);
		}
	}
	public OB(): TerminalNode[];
	public OB(i: number): TerminalNode;
	public OB(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.OB);
		} else {
			return this.getToken(QueryParser.OB, i);
		}
	}
	public CB(): TerminalNode[];
	public CB(i: number): TerminalNode;
	public CB(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.CB);
		} else {
			return this.getToken(QueryParser.CB, i);
		}
	}
	public SPECIAL(): TerminalNode[];
	public SPECIAL(i: number): TerminalNode;
	public SPECIAL(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.SPECIAL);
		} else {
			return this.getToken(QueryParser.SPECIAL, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_ignored; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterIgnored) {
			listener.enterIgnored(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitIgnored) {
			listener.exitIgnored(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitIgnored) {
			return visitor.visitIgnored(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParamNamedContext extends ParserRuleContext {
	public PARAM_MARK(): TerminalNode { return this.getToken(QueryParser.PARAM_MARK, 0); }
	public OB(): TerminalNode { return this.getToken(QueryParser.OB, 0); }
	public ID(): TerminalNode { return this.getToken(QueryParser.ID, 0); }
	public CB(): TerminalNode { return this.getToken(QueryParser.CB, 0); }
	public formatter(): FormatterContext | undefined {
		return this.tryGetRuleContext(0, FormatterContext);
	}
	public NULLABILITY_MARK(): TerminalNode | undefined { return this.tryGetToken(QueryParser.NULLABILITY_MARK, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_paramNamed; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterParamNamed) {
			listener.enterParamNamed(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitParamNamed) {
			listener.exitParamNamed(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitParamNamed) {
			return visitor.visitParamNamed(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParamIndexedContext extends ParserRuleContext {
	public PARAM_MARK(): TerminalNode { return this.getToken(QueryParser.PARAM_MARK, 0); }
	public INTEGER(): TerminalNode { return this.getToken(QueryParser.INTEGER, 0); }
	public formatter(): FormatterContext | undefined {
		return this.tryGetRuleContext(0, FormatterContext);
	}
	public NULLABILITY_MARK(): TerminalNode | undefined { return this.tryGetToken(QueryParser.NULLABILITY_MARK, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_paramIndexed; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterParamIndexed) {
			listener.enterParamIndexed(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitParamIndexed) {
			listener.exitParamIndexed(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitParamIndexed) {
			return visitor.visitParamIndexed(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormatterContext extends ParserRuleContext {
	public FORMATTER_MARK(): TerminalNode | undefined { return this.tryGetToken(QueryParser.FORMATTER_MARK, 0); }
	public ID(): TerminalNode | undefined { return this.tryGetToken(QueryParser.ID, 0); }
	public FORMATTER_SHORT(): TerminalNode | undefined { return this.tryGetToken(QueryParser.FORMATTER_SHORT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_formatter; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterFormatter) {
			listener.enterFormatter(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitFormatter) {
			listener.exitFormatter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitFormatter) {
			return visitor.visitFormatter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


