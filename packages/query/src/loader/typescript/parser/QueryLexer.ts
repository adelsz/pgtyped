// Generated from src/loader/typescript/grammar/QueryLexer.g4 by ANTLR 4.7.3-SNAPSHOT


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
	public static readonly SINGULAR_PARAM_MARK = 2;
	public static readonly PLURAL_PARAM_MARK = 3;
	public static readonly COMMA = 4;
	public static readonly OB = 5;
	public static readonly CB = 6;
	public static readonly WORD = 7;
	public static readonly SPECIAL = 8;
	public static readonly EOF_STATEMENT = 9;
	public static readonly WSL = 10;
	public static readonly STRING = 11;

	// tslint:disable:no-trailing-whitespace
	public static readonly channelNames: string[] = [
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN",
	];

	// tslint:disable:no-trailing-whitespace
	public static readonly modeNames: string[] = [
		"DEFAULT_MODE",
	];

	public static readonly ruleNames: string[] = [
		"QUOT", "ID", "SID", "SINGULAR_PARAM_MARK", "PLURAL_PARAM_MARK", "COMMA", 
		"OB", "CB", "WORD", "SPECIAL", "EOF_STATEMENT", "WSL", "STRING",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, "'$'", "'$$'", "','", "'('", "')'", undefined, undefined, 
		"';'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "ID", "SINGULAR_PARAM_MARK", "PLURAL_PARAM_MARK", "COMMA", 
		"OB", "CB", "WORD", "SPECIAL", "EOF_STATEMENT", "WSL", "STRING",
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
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\rT\b\x01\x04" +
		"\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
		"\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r" +
		"\x04\x0E\t\x0E\x03\x02\x03\x02\x03\x03\x03\x03\x07\x03\"\n\x03\f\x03\x0E" +
		"\x03%\v\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03\x06\x03" +
		"\x06\x03\x06\x03\x07\x03\x07\x03\b\x03\b\x03\t\x03\t\x03\n\x06\n7\n\n" +
		"\r\n\x0E\n8\x03\v\x06\v<\n\v\r\v\x0E\v=\x03\f\x03\f\x03\r\x06\rC\n\r\r" +
		"\r\x0E\rD\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x07\x0EL\n\x0E\f\x0E\x0E" +
		"\x0EO\v\x0E\x03\x0E\x03\x0E\x05\x0ES\n\x0E\x03M\x02\x02\x0F\x03\x02\x02" +
		"\x05\x02\x03\x07\x02\x02\t\x02\x04\v\x02\x05\r\x02\x06\x0F\x02\x07\x11" +
		"\x02\b\x13\x02\t\x15\x02\n\x17\x02\v\x19\x02\f\x1B\x02\r\x03\x02\x07\x05" +
		"\x02C\\aac|\x06\x022;C\\aac|\v\x02#(,-/1<<>B]]_`bb}\x80\x05\x02\v\f\x0F" +
		"\x0F\"\"\x03\x02^^\x02W\x02\x07\x03\x02\x02\x02\x02\t\x03\x02\x02\x02" +
		"\x02\v\x03\x02\x02\x02\x02\r\x03\x02\x02\x02\x02\x0F\x03\x02\x02\x02\x02" +
		"\x11\x03\x02\x02\x02\x02\x13\x03\x02\x02\x02\x02\x15\x03\x02\x02\x02\x02" +
		"\x17\x03\x02\x02\x02\x02\x19\x03\x02\x02\x02\x02\x1B\x03\x02\x02\x02\x03" +
		"\x1D\x03\x02\x02\x02\x05\x1F\x03\x02\x02\x02\x07&\x03\x02\x02\x02\t*\x03" +
		"\x02\x02\x02\v,\x03\x02\x02\x02\r/\x03\x02\x02\x02\x0F1\x03\x02\x02\x02" +
		"\x113\x03\x02\x02\x02\x136\x03\x02\x02\x02\x15;\x03\x02\x02\x02\x17?\x03" +
		"\x02\x02\x02\x19B\x03\x02\x02\x02\x1BH\x03\x02\x02\x02\x1D\x1E\x07)\x02" +
		"\x02\x1E\x04\x03\x02\x02\x02\x1F#\t\x02\x02\x02 \"\t\x03\x02\x02! \x03" +
		"\x02\x02\x02\"%\x03\x02\x02\x02#!\x03\x02\x02\x02#$\x03\x02\x02\x02$\x06" +
		"\x03\x02\x02\x02%#\x03\x02\x02\x02&\'\x05\x05\x03\x02\'(\x03\x02\x02\x02" +
		"()\b\x04\x02\x02)\b\x03\x02\x02\x02*+\x07&\x02\x02+\n\x03\x02\x02\x02" +
		",-\x07&\x02\x02-.\x07&\x02\x02.\f\x03\x02\x02\x02/0\x07.\x02\x020\x0E" +
		"\x03\x02\x02\x0212\x07*\x02\x022\x10\x03\x02\x02\x0234\x07+\x02\x024\x12" +
		"\x03\x02\x02\x0257\t\x03\x02\x0265\x03\x02\x02\x0278\x03\x02\x02\x028" +
		"6\x03\x02\x02\x0289\x03\x02\x02\x029\x14\x03\x02\x02\x02:<\t\x04\x02\x02" +
		";:\x03\x02\x02\x02<=\x03\x02\x02\x02=;\x03\x02\x02\x02=>\x03\x02\x02\x02" +
		">\x16\x03\x02\x02\x02?@\x07=\x02\x02@\x18\x03\x02\x02\x02AC\t\x05\x02" +
		"\x02BA\x03\x02\x02\x02CD\x03\x02\x02\x02DB\x03\x02\x02\x02DE\x03\x02\x02" +
		"\x02EF\x03\x02\x02\x02FG\b\r\x03\x02G\x1A\x03\x02\x02\x02HR\x05\x03\x02" +
		"\x02IS\x05\x03\x02\x02JL\v\x02\x02\x02KJ\x03\x02\x02\x02LO\x03\x02\x02" +
		"\x02MN\x03\x02\x02\x02MK\x03\x02\x02\x02NP\x03\x02\x02\x02OM\x03\x02\x02" +
		"\x02PQ\n\x06\x02\x02QS\x05\x03\x02\x02RI\x03\x02\x02\x02RM\x03\x02\x02" +
		"\x02S\x1C\x03\x02\x02\x02\t\x02#8=DMR\x04\t\x03\x02\b\x02\x02";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!QueryLexer.__ATN) {
			QueryLexer.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(QueryLexer._serializedATN));
		}

		return QueryLexer.__ATN;
	}

}

