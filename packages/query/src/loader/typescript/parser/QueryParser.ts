// Generated from src/loader/typescript/grammar/QueryParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { QueryParserListener } from "./QueryParserListener";
import { QueryParserVisitor } from "./QueryParserVisitor";


export class QueryParser extends Parser {
	public static readonly ID = 1;
	public static readonly AS = 2;
	public static readonly SINGULAR_PARAM_MARK = 3;
	public static readonly PLURAL_PARAM_MARK = 4;
	public static readonly COMMA = 5;
	public static readonly OB = 6;
	public static readonly CB = 7;
	public static readonly WORD = 8;
	public static readonly REQUIRED_MARK = 9;
	public static readonly OPTIONAL_MARK = 10;
	public static readonly DOUBLE_QUOTE = 11;
	public static readonly SPECIAL = 12;
	public static readonly EOF_STATEMENT = 13;
	public static readonly WSL = 14;
	public static readonly STRING = 15;
	public static readonly RULE_input = 0;
	public static readonly RULE_query = 1;
	public static readonly RULE_param = 2;
	public static readonly RULE_ignored = 3;
	public static readonly RULE_scalarParam = 4;
	public static readonly RULE_pickParam = 5;
	public static readonly RULE_arrayPickParam = 6;
	public static readonly RULE_arrayParam = 7;
	public static readonly RULE_scalarParamName = 8;
	public static readonly RULE_paramName = 9;
	public static readonly RULE_pickKey = 10;
	public static readonly RULE_hintedColumnAliasName = 11;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"input", "query", "param", "ignored", "scalarParam", "pickParam", "arrayPickParam", 
		"arrayParam", "scalarParamName", "paramName", "pickKey", "hintedColumnAliasName",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, "'$'", "'$$'", "','", "'('", "')'", undefined, 
		"'!'", "'?'", "'\"'", undefined, "';'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "ID", "AS", "SINGULAR_PARAM_MARK", "PLURAL_PARAM_MARK", "COMMA", 
		"OB", "CB", "WORD", "REQUIRED_MARK", "OPTIONAL_MARK", "DOUBLE_QUOTE", 
		"SPECIAL", "EOF_STATEMENT", "WSL", "STRING",
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
			this.state = 24;
			this.query();
			this.state = 26;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QueryParser.EOF_STATEMENT) {
				{
				this.state = 25;
				this.match(QueryParser.EOF_STATEMENT);
				}
			}

			this.state = 28;
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
			this.state = 30;
			this.ignored();
			this.state = 36;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QueryParser.ID) | (1 << QueryParser.AS) | (1 << QueryParser.SINGULAR_PARAM_MARK) | (1 << QueryParser.PLURAL_PARAM_MARK) | (1 << QueryParser.COMMA) | (1 << QueryParser.OB) | (1 << QueryParser.CB) | (1 << QueryParser.WORD) | (1 << QueryParser.REQUIRED_MARK) | (1 << QueryParser.OPTIONAL_MARK) | (1 << QueryParser.DOUBLE_QUOTE) | (1 << QueryParser.SPECIAL) | (1 << QueryParser.STRING))) !== 0)) {
				{
				this.state = 34;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
				case 1:
					{
					this.state = 31;
					this.param();
					}
					break;

				case 2:
					{
					this.state = 32;
					this.hintedColumnAliasName();
					}
					break;

				case 3:
					{
					this.state = 33;
					this.ignored();
					}
					break;
				}
				}
				this.state = 38;
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
			this.state = 43;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 39;
				this.pickParam();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 40;
				this.arrayPickParam();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 41;
				this.scalarParam();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 42;
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
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 45;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << QueryParser.ID) | (1 << QueryParser.AS) | (1 << QueryParser.COMMA) | (1 << QueryParser.OB) | (1 << QueryParser.CB) | (1 << QueryParser.WORD) | (1 << QueryParser.REQUIRED_MARK) | (1 << QueryParser.OPTIONAL_MARK) | (1 << QueryParser.DOUBLE_QUOTE) | (1 << QueryParser.SPECIAL) | (1 << QueryParser.STRING))) !== 0))) {
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
	public scalarParam(): ScalarParamContext {
		let _localctx: ScalarParamContext = new ScalarParamContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, QueryParser.RULE_scalarParam);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 47;
			this.match(QueryParser.SINGULAR_PARAM_MARK);
			this.state = 48;
			this.scalarParamName();
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
	public pickParam(): PickParamContext {
		let _localctx: PickParamContext = new PickParamContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, QueryParser.RULE_pickParam);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 50;
			this.match(QueryParser.SINGULAR_PARAM_MARK);
			this.state = 51;
			this.paramName();
			this.state = 52;
			this.match(QueryParser.OB);
			this.state = 53;
			this.pickKey();
			this.state = 58;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 54;
					this.match(QueryParser.COMMA);
					this.state = 55;
					this.pickKey();
					}
					}
				}
				this.state = 60;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
			}
			this.state = 62;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QueryParser.COMMA) {
				{
				this.state = 61;
				this.match(QueryParser.COMMA);
				}
			}

			this.state = 64;
			this.match(QueryParser.CB);
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
	public arrayPickParam(): ArrayPickParamContext {
		let _localctx: ArrayPickParamContext = new ArrayPickParamContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, QueryParser.RULE_arrayPickParam);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 66;
			this.match(QueryParser.PLURAL_PARAM_MARK);
			this.state = 67;
			this.paramName();
			this.state = 68;
			this.match(QueryParser.OB);
			this.state = 69;
			this.pickKey();
			this.state = 74;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 6, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 70;
					this.match(QueryParser.COMMA);
					this.state = 71;
					this.pickKey();
					}
					}
				}
				this.state = 76;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 6, this._ctx);
			}
			this.state = 78;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QueryParser.COMMA) {
				{
				this.state = 77;
				this.match(QueryParser.COMMA);
				}
			}

			this.state = 80;
			this.match(QueryParser.CB);
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
	public arrayParam(): ArrayParamContext {
		let _localctx: ArrayParamContext = new ArrayParamContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, QueryParser.RULE_arrayParam);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 82;
			this.match(QueryParser.PLURAL_PARAM_MARK);
			this.state = 83;
			this.scalarParamName();
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
	public scalarParamName(): ScalarParamNameContext {
		let _localctx: ScalarParamNameContext = new ScalarParamNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, QueryParser.RULE_scalarParamName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 85;
			this.match(QueryParser.ID);
			this.state = 87;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				{
				this.state = 86;
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
	public paramName(): ParamNameContext {
		let _localctx: ParamNameContext = new ParamNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, QueryParser.RULE_paramName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 89;
			this.match(QueryParser.ID);
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
	public pickKey(): PickKeyContext {
		let _localctx: PickKeyContext = new PickKeyContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, QueryParser.RULE_pickKey);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 91;
			this.match(QueryParser.ID);
			this.state = 93;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === QueryParser.REQUIRED_MARK) {
				{
				this.state = 92;
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
	public hintedColumnAliasName(): HintedColumnAliasNameContext {
		let _localctx: HintedColumnAliasNameContext = new HintedColumnAliasNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, QueryParser.RULE_hintedColumnAliasName);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 95;
			this.match(QueryParser.AS);
			this.state = 96;
			this.match(QueryParser.DOUBLE_QUOTE);
			this.state = 97;
			this.match(QueryParser.ID);
			this.state = 98;
			_la = this._input.LA(1);
			if (!(_la === QueryParser.REQUIRED_MARK || _la === QueryParser.OPTIONAL_MARK)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 99;
			this.match(QueryParser.DOUBLE_QUOTE);
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
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x11h\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x03" +
		"\x02\x03\x02\x05\x02\x1D\n\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x07\x03%\n\x03\f\x03\x0E\x03(\v\x03\x03\x04\x03\x04\x03\x04\x03" +
		"\x04\x05\x04.\n\x04\x03\x05\x03\x05\x03\x06\x03\x06\x03\x06\x03\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x03\x07\x07\x07;\n\x07\f\x07\x0E\x07>\v\x07" +
		"\x03\x07\x05\x07A\n\x07\x03\x07\x03\x07\x03\b\x03\b\x03\b\x03\b\x03\b" +
		"\x03\b\x07\bK\n\b\f\b\x0E\bN\v\b\x03\b\x05\bQ\n\b\x03\b\x03\b\x03\t\x03" +
		"\t\x03\t\x03\n\x03\n\x05\nZ\n\n\x03\v\x03\v\x03\f\x03\f\x05\f`\n\f\x03" +
		"\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x02\x02\x02\x0E\x02\x02\x04\x02" +
		"\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18" +
		"\x02\x02\x04\x05\x02\x03\x04\x07\x0E\x11\x11\x03\x02\v\f\x02h\x02\x1A" +
		"\x03\x02\x02\x02\x04 \x03\x02\x02\x02\x06-\x03\x02\x02\x02\b/\x03\x02" +
		"\x02\x02\n1\x03\x02\x02\x02\f4\x03\x02\x02\x02\x0ED\x03\x02\x02\x02\x10" +
		"T\x03\x02\x02\x02\x12W\x03\x02\x02\x02\x14[\x03\x02\x02\x02\x16]\x03\x02" +
		"\x02\x02\x18a\x03\x02\x02\x02\x1A\x1C\x05\x04\x03\x02\x1B\x1D\x07\x0F" +
		"\x02\x02\x1C\x1B\x03\x02\x02\x02\x1C\x1D\x03\x02\x02\x02\x1D\x1E\x03\x02" +
		"\x02\x02\x1E\x1F\x07\x02\x02\x03\x1F\x03\x03\x02\x02\x02 &\x05\b\x05\x02" +
		"!%\x05\x06\x04\x02\"%\x05\x18\r\x02#%\x05\b\x05\x02$!\x03\x02\x02\x02" +
		"$\"\x03\x02\x02\x02$#\x03\x02\x02\x02%(\x03\x02\x02\x02&$\x03\x02\x02" +
		"\x02&\'\x03\x02\x02\x02\'\x05\x03\x02\x02\x02(&\x03\x02\x02\x02).\x05" +
		"\f\x07\x02*.\x05\x0E\b\x02+.\x05\n\x06\x02,.\x05\x10\t\x02-)\x03\x02\x02" +
		"\x02-*\x03\x02\x02\x02-+\x03\x02\x02\x02-,\x03\x02\x02\x02.\x07\x03\x02" +
		"\x02\x02/0\t\x02\x02\x020\t\x03\x02\x02\x0212\x07\x05\x02\x0223\x05\x12" +
		"\n\x023\v\x03\x02\x02\x0245\x07\x05\x02\x0256\x05\x14\v\x0267\x07\b\x02" +
		"\x027<\x05\x16\f\x0289\x07\x07\x02\x029;\x05\x16\f\x02:8\x03\x02\x02\x02" +
		";>\x03\x02\x02\x02<:\x03\x02\x02\x02<=\x03\x02\x02\x02=@\x03\x02\x02\x02" +
		"><\x03\x02\x02\x02?A\x07\x07\x02\x02@?\x03\x02\x02\x02@A\x03\x02\x02\x02" +
		"AB\x03\x02\x02\x02BC\x07\t\x02\x02C\r\x03\x02\x02\x02DE\x07\x06\x02\x02" +
		"EF\x05\x14\v\x02FG\x07\b\x02\x02GL\x05\x16\f\x02HI\x07\x07\x02\x02IK\x05" +
		"\x16\f\x02JH\x03\x02\x02\x02KN\x03\x02\x02\x02LJ\x03\x02\x02\x02LM\x03" +
		"\x02\x02\x02MP\x03\x02\x02\x02NL\x03\x02\x02\x02OQ\x07\x07\x02\x02PO\x03" +
		"\x02\x02\x02PQ\x03\x02\x02\x02QR\x03\x02\x02\x02RS\x07\t\x02\x02S\x0F" +
		"\x03\x02\x02\x02TU\x07\x06\x02\x02UV\x05\x12\n\x02V\x11\x03\x02\x02\x02" +
		"WY\x07\x03\x02\x02XZ\x07\v\x02\x02YX\x03\x02\x02\x02YZ\x03\x02\x02\x02" +
		"Z\x13\x03\x02\x02\x02[\\\x07\x03\x02\x02\\\x15\x03\x02\x02\x02]_\x07\x03" +
		"\x02\x02^`\x07\v\x02\x02_^\x03\x02\x02\x02_`\x03\x02\x02\x02`\x17\x03" +
		"\x02\x02\x02ab\x07\x04\x02\x02bc\x07\r\x02\x02cd\x07\x03\x02\x02de\t\x03" +
		"\x02\x02ef\x07\r\x02\x02f\x19\x03\x02\x02\x02\f\x1C$&-<@LPY_";
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
	public hintedColumnAliasName(): HintedColumnAliasNameContext[];
	public hintedColumnAliasName(i: number): HintedColumnAliasNameContext;
	public hintedColumnAliasName(i?: number): HintedColumnAliasNameContext | HintedColumnAliasNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(HintedColumnAliasNameContext);
		} else {
			return this.getRuleContext(i, HintedColumnAliasNameContext);
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
	public pickParam(): PickParamContext | undefined {
		return this.tryGetRuleContext(0, PickParamContext);
	}
	public arrayPickParam(): ArrayPickParamContext | undefined {
		return this.tryGetRuleContext(0, ArrayPickParamContext);
	}
	public scalarParam(): ScalarParamContext | undefined {
		return this.tryGetRuleContext(0, ScalarParamContext);
	}
	public arrayParam(): ArrayParamContext | undefined {
		return this.tryGetRuleContext(0, ArrayParamContext);
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
	public ID(): TerminalNode | undefined { return this.tryGetToken(QueryParser.ID, 0); }
	public WORD(): TerminalNode | undefined { return this.tryGetToken(QueryParser.WORD, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(QueryParser.STRING, 0); }
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(QueryParser.COMMA, 0); }
	public OB(): TerminalNode | undefined { return this.tryGetToken(QueryParser.OB, 0); }
	public CB(): TerminalNode | undefined { return this.tryGetToken(QueryParser.CB, 0); }
	public SPECIAL(): TerminalNode | undefined { return this.tryGetToken(QueryParser.SPECIAL, 0); }
	public REQUIRED_MARK(): TerminalNode | undefined { return this.tryGetToken(QueryParser.REQUIRED_MARK, 0); }
	public OPTIONAL_MARK(): TerminalNode | undefined { return this.tryGetToken(QueryParser.OPTIONAL_MARK, 0); }
	public AS(): TerminalNode | undefined { return this.tryGetToken(QueryParser.AS, 0); }
	public DOUBLE_QUOTE(): TerminalNode | undefined { return this.tryGetToken(QueryParser.DOUBLE_QUOTE, 0); }
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


export class ScalarParamContext extends ParserRuleContext {
	public SINGULAR_PARAM_MARK(): TerminalNode { return this.getToken(QueryParser.SINGULAR_PARAM_MARK, 0); }
	public scalarParamName(): ScalarParamNameContext {
		return this.getRuleContext(0, ScalarParamNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_scalarParam; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterScalarParam) {
			listener.enterScalarParam(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitScalarParam) {
			listener.exitScalarParam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitScalarParam) {
			return visitor.visitScalarParam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PickParamContext extends ParserRuleContext {
	public SINGULAR_PARAM_MARK(): TerminalNode { return this.getToken(QueryParser.SINGULAR_PARAM_MARK, 0); }
	public paramName(): ParamNameContext {
		return this.getRuleContext(0, ParamNameContext);
	}
	public OB(): TerminalNode { return this.getToken(QueryParser.OB, 0); }
	public pickKey(): PickKeyContext[];
	public pickKey(i: number): PickKeyContext;
	public pickKey(i?: number): PickKeyContext | PickKeyContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PickKeyContext);
		} else {
			return this.getRuleContext(i, PickKeyContext);
		}
	}
	public CB(): TerminalNode { return this.getToken(QueryParser.CB, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.COMMA);
		} else {
			return this.getToken(QueryParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_pickParam; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterPickParam) {
			listener.enterPickParam(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitPickParam) {
			listener.exitPickParam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitPickParam) {
			return visitor.visitPickParam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayPickParamContext extends ParserRuleContext {
	public PLURAL_PARAM_MARK(): TerminalNode { return this.getToken(QueryParser.PLURAL_PARAM_MARK, 0); }
	public paramName(): ParamNameContext {
		return this.getRuleContext(0, ParamNameContext);
	}
	public OB(): TerminalNode { return this.getToken(QueryParser.OB, 0); }
	public pickKey(): PickKeyContext[];
	public pickKey(i: number): PickKeyContext;
	public pickKey(i?: number): PickKeyContext | PickKeyContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PickKeyContext);
		} else {
			return this.getRuleContext(i, PickKeyContext);
		}
	}
	public CB(): TerminalNode { return this.getToken(QueryParser.CB, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.COMMA);
		} else {
			return this.getToken(QueryParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_arrayPickParam; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterArrayPickParam) {
			listener.enterArrayPickParam(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitArrayPickParam) {
			listener.exitArrayPickParam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitArrayPickParam) {
			return visitor.visitArrayPickParam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayParamContext extends ParserRuleContext {
	public PLURAL_PARAM_MARK(): TerminalNode { return this.getToken(QueryParser.PLURAL_PARAM_MARK, 0); }
	public scalarParamName(): ScalarParamNameContext {
		return this.getRuleContext(0, ScalarParamNameContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_arrayParam; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterArrayParam) {
			listener.enterArrayParam(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitArrayParam) {
			listener.exitArrayParam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitArrayParam) {
			return visitor.visitArrayParam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ScalarParamNameContext extends ParserRuleContext {
	public ID(): TerminalNode { return this.getToken(QueryParser.ID, 0); }
	public REQUIRED_MARK(): TerminalNode | undefined { return this.tryGetToken(QueryParser.REQUIRED_MARK, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_scalarParamName; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterScalarParamName) {
			listener.enterScalarParamName(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitScalarParamName) {
			listener.exitScalarParamName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitScalarParamName) {
			return visitor.visitScalarParamName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParamNameContext extends ParserRuleContext {
	public ID(): TerminalNode { return this.getToken(QueryParser.ID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_paramName; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterParamName) {
			listener.enterParamName(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitParamName) {
			listener.exitParamName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitParamName) {
			return visitor.visitParamName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PickKeyContext extends ParserRuleContext {
	public ID(): TerminalNode { return this.getToken(QueryParser.ID, 0); }
	public REQUIRED_MARK(): TerminalNode | undefined { return this.tryGetToken(QueryParser.REQUIRED_MARK, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_pickKey; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterPickKey) {
			listener.enterPickKey(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitPickKey) {
			listener.exitPickKey(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitPickKey) {
			return visitor.visitPickKey(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HintedColumnAliasNameContext extends ParserRuleContext {
	public AS(): TerminalNode { return this.getToken(QueryParser.AS, 0); }
	public DOUBLE_QUOTE(): TerminalNode[];
	public DOUBLE_QUOTE(i: number): TerminalNode;
	public DOUBLE_QUOTE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(QueryParser.DOUBLE_QUOTE);
		} else {
			return this.getToken(QueryParser.DOUBLE_QUOTE, i);
		}
	}
	public ID(): TerminalNode { return this.getToken(QueryParser.ID, 0); }
	public REQUIRED_MARK(): TerminalNode | undefined { return this.tryGetToken(QueryParser.REQUIRED_MARK, 0); }
	public OPTIONAL_MARK(): TerminalNode | undefined { return this.tryGetToken(QueryParser.OPTIONAL_MARK, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return QueryParser.RULE_hintedColumnAliasName; }
	// @Override
	public enterRule(listener: QueryParserListener): void {
		if (listener.enterHintedColumnAliasName) {
			listener.enterHintedColumnAliasName(this);
		}
	}
	// @Override
	public exitRule(listener: QueryParserListener): void {
		if (listener.exitHintedColumnAliasName) {
			listener.exitHintedColumnAliasName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: QueryParserVisitor<Result>): Result {
		if (visitor.visitHintedColumnAliasName) {
			return visitor.visitHintedColumnAliasName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


