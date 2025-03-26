import { ATN } from "antlr4ts/atn/ATN.js";
import { CharStream } from "antlr4ts/CharStream.js";
import { Lexer } from "antlr4ts/Lexer.js";
import { Vocabulary } from "antlr4ts/Vocabulary.js";
export declare class SQLLexer extends Lexer {
    static readonly ID = 1;
    static readonly LINE_COMMENT = 2;
    static readonly OPEN_COMMENT = 3;
    static readonly S_REQUIRED_MARK = 4;
    static readonly WORD = 5;
    static readonly EOF_STATEMENT = 6;
    static readonly WSL = 7;
    static readonly STRING = 8;
    static readonly DOLLAR_STRING = 9;
    static readonly PARAM_MARK = 10;
    static readonly WS = 11;
    static readonly TRANSFORM_ARROW = 12;
    static readonly SPREAD = 13;
    static readonly NAME_TAG = 14;
    static readonly TYPE_TAG = 15;
    static readonly OB = 16;
    static readonly CB = 17;
    static readonly COMMA = 18;
    static readonly C_REQUIRED_MARK = 19;
    static readonly ANY = 20;
    static readonly CLOSE_COMMENT = 21;
    static readonly DOLLAR = 22;
    static readonly CAST = 23;
    static readonly COMMENT = 1;
    static readonly channelNames: string[];
    static readonly modeNames: string[];
    static readonly ruleNames: string[];
    private static readonly _LITERAL_NAMES;
    private static readonly _SYMBOLIC_NAMES;
    static readonly VOCABULARY: Vocabulary;
    get vocabulary(): Vocabulary;
    constructor(input: CharStream);
    get grammarFileName(): string;
    get ruleNames(): string[];
    get serializedATN(): string;
    get channelNames(): string[];
    get modeNames(): string[];
    static readonly _serializedATN: string;
    static __ATN: ATN;
    static get _ATN(): ATN;
}
