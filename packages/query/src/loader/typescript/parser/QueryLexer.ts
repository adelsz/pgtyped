// Generated from src/loader/typescript/grammar/QueryLexer.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { CharStream } from "antlr4ts/CharStream";
import { Lexer } from "antlr4ts/Lexer";
import { LexerATNSimulator } from "antlr4ts/atn/LexerATNSimulator";
import { NotNull } from "antlr4ts/Decorators";
import { Override } from "antlr4ts/Decorators";
import { RuleContext } from "antlr4ts/RuleContext";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";


export class QueryLexer extends Lexer {
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

	// tslint:disable:no-trailing-whitespace
	public static readonly channelNames: string[] = [
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN",
	];

	// tslint:disable:no-trailing-whitespace
	public static readonly modeNames: string[] = [
		"DEFAULT_MODE",
	];

	public static readonly ruleNames: string[] = [
		"QUOT", "ID", "AS", "SID", "SINGULAR_PARAM_MARK", "PLURAL_PARAM_MARK", 
		"COMMA", "OB", "CB", "WORD", "REQUIRED_MARK", "OPTIONAL_MARK", "DOUBLE_QUOTE", 
		"SPECIAL", "EOF_STATEMENT", "WSL", "STRING",
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
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(QueryLexer._LITERAL_NAMES, QueryLexer._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return QueryLexer.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(QueryLexer._ATN, this);
	}

	// @Override
	public get grammarFileName(): string { return "QueryLexer.g4"; }

	// @Override
	public get ruleNames(): string[] { return QueryLexer.ruleNames; }

	// @Override
	public get serializedATN(): string { return QueryLexer._serializedATN; }

	// @Override
	public get channelNames(): string[] { return QueryLexer.channelNames; }

	// @Override
	public get modeNames(): string[] { return QueryLexer.modeNames; }

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\x11h\b\x01\x04" +
		"\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
		"\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r" +
		"\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12" +
		"\x03\x02\x03\x02\x03\x03\x03\x03\x07\x03*\n\x03\f\x03\x0E\x03-\v\x03\x03" +
		"\x04\x03\x04\x03\x04\x03\x04\x05\x043\n\x04\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x03\x06\x03\x06\x03\x07\x03\x07\x03\x07\x03\b\x03\b\x03\t\x03\t\x03" +
		"\n\x03\n\x03\v\x06\vE\n\v\r\v\x0E\vF\x03\f\x03\f\x03\r\x03\r\x03\x0E\x03" +
		"\x0E\x03\x0F\x06\x0FP\n\x0F\r\x0F\x0E\x0FQ\x03\x10\x03\x10\x03\x11\x06" +
		"\x11W\n\x11\r\x11\x0E\x11X\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x07" +
		"\x12`\n\x12\f\x12\x0E\x12c\v\x12\x03\x12\x03\x12\x05\x12g\n\x12\x03a\x02" +
		"\x02\x13\x03\x02\x02\x05\x02\x03\x07\x02\x04\t\x02\x02\v\x02\x05\r\x02" +
		"\x06\x0F\x02\x07\x11\x02\b\x13\x02\t\x15\x02\n\x17\x02\v\x19\x02\f\x1B" +
		"\x02\r\x1D\x02\x0E\x1F\x02\x0F!\x02\x10#\x02\x11\x03\x02\x07\x05\x02C" +
		"\\aac|\x06\x022;C\\aac|\f\x02%(,-/1<<>@BB]]_`bb}\x80\x05\x02\v\f\x0F\x0F" +
		"\"\"\x03\x02^^\x02l\x02\x07\x03\x02\x02\x02\x02\t\x03\x02\x02\x02\x02" +
		"\v\x03\x02\x02\x02\x02\r\x03\x02\x02\x02\x02\x0F\x03\x02\x02\x02\x02\x11" +
		"\x03\x02\x02\x02\x02\x13\x03\x02\x02\x02\x02\x15\x03\x02\x02\x02\x02\x17" +
		"\x03\x02\x02\x02\x02\x19\x03\x02\x02\x02\x02\x1B\x03\x02\x02\x02\x02\x1D" +
		"\x03\x02\x02\x02\x02\x1F\x03\x02\x02\x02\x02!\x03\x02\x02\x02\x02#\x03" +
		"\x02\x02\x02\x03%\x03\x02\x02\x02\x05\'\x03\x02\x02\x02\x072\x03\x02\x02" +
		"\x02\t4\x03\x02\x02\x02\v8\x03\x02\x02\x02\r:\x03\x02\x02\x02\x0F=\x03" +
		"\x02\x02\x02\x11?\x03\x02\x02\x02\x13A\x03\x02\x02\x02\x15D\x03\x02\x02" +
		"\x02\x17H\x03\x02\x02\x02\x19J\x03\x02\x02\x02\x1BL\x03\x02\x02\x02\x1D" +
		"O\x03\x02\x02\x02\x1FS\x03\x02\x02\x02!V\x03\x02\x02\x02#\\\x03\x02\x02" +
		"\x02%&\x07)\x02\x02&\x04\x03\x02\x02\x02\'+\t\x02\x02\x02(*\t\x03\x02" +
		"\x02)(\x03\x02\x02\x02*-\x03\x02\x02\x02+)\x03\x02\x02\x02+,\x03\x02\x02" +
		"\x02,\x06\x03\x02\x02\x02-+\x03\x02\x02\x02./\x07c\x02\x02/3\x07u\x02" +
		"\x0201\x07C\x02\x0213\x07U\x02\x022.\x03\x02\x02\x0220\x03\x02\x02\x02" +
		"3\b\x03\x02\x02\x0245\x05\x05\x03\x0256\x03\x02\x02\x0267\b\x05\x02\x02" +
		"7\n\x03\x02\x02\x0289\x07&\x02\x029\f\x03\x02\x02\x02:;\x07&\x02\x02;" +
		"<\x07&\x02\x02<\x0E\x03\x02\x02\x02=>\x07.\x02\x02>\x10\x03\x02\x02\x02" +
		"?@\x07*\x02\x02@\x12\x03\x02\x02\x02AB\x07+\x02\x02B\x14\x03\x02\x02\x02" +
		"CE\t\x03\x02\x02DC\x03\x02\x02\x02EF\x03\x02\x02\x02FD\x03\x02\x02\x02" +
		"FG\x03\x02\x02\x02G\x16\x03\x02\x02\x02HI\x07#\x02\x02I\x18\x03\x02\x02" +
		"\x02JK\x07A\x02\x02K\x1A\x03\x02\x02\x02LM\x07$\x02\x02M\x1C\x03\x02\x02" +
		"\x02NP\t\x04\x02\x02ON\x03\x02\x02\x02PQ\x03\x02\x02\x02QO\x03\x02\x02" +
		"\x02QR\x03\x02\x02\x02R\x1E\x03\x02\x02\x02ST\x07=\x02\x02T \x03\x02\x02" +
		"\x02UW\t\x05\x02\x02VU\x03\x02\x02\x02WX\x03\x02\x02\x02XV\x03\x02\x02" +
		"\x02XY\x03\x02\x02\x02YZ\x03\x02\x02\x02Z[\b\x11\x03\x02[\"\x03\x02\x02" +
		"\x02\\f\x05\x03\x02\x02]g\x05\x03\x02\x02^`\v\x02\x02\x02_^\x03\x02\x02" +
		"\x02`c\x03\x02\x02\x02ab\x03\x02\x02\x02a_\x03\x02\x02\x02bd\x03\x02\x02" +
		"\x02ca\x03\x02\x02\x02de\n\x06\x02\x02eg\x05\x03\x02\x02f]\x03\x02\x02" +
		"\x02fa\x03\x02\x02\x02g$\x03\x02\x02\x02\n\x02+2FQXaf\x04\t\x03\x02\b" +
		"\x02\x02";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!QueryLexer.__ATN) {
			QueryLexer.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(QueryLexer._serializedATN));
		}

		return QueryLexer.__ATN;
	}

}

