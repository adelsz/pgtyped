// Generated from src/loader/sql/grammar/SQLLexer.g4 by ANTLR 4.7.3-SNAPSHOT

import { ATN } from 'antlr4ts/atn/ATN';
import { ATNDeserializer } from 'antlr4ts/atn/ATNDeserializer';
import { CharStream } from 'antlr4ts/CharStream';
import { Lexer } from 'antlr4ts/Lexer';
import { LexerATNSimulator } from 'antlr4ts/atn/LexerATNSimulator';
import { NotNull } from 'antlr4ts/Decorators';
import { Override } from 'antlr4ts/Decorators';
import { RuleContext } from 'antlr4ts/RuleContext';
import { Vocabulary } from 'antlr4ts/Vocabulary';
import { VocabularyImpl } from 'antlr4ts/VocabularyImpl';

import * as Utils from 'antlr4ts/misc/Utils';

export class SQLLexer extends Lexer {
  public static readonly ID = 1;
  public static readonly OPEN_COMMENT = 2;
  public static readonly WORD = 3;
  public static readonly EOF_STATEMENT = 4;
  public static readonly WSL = 5;
  public static readonly STRING = 6;
  public static readonly PARAM_MARK = 7;
  public static readonly WS = 8;
  public static readonly TRANSFORM_ARROW = 9;
  public static readonly SPREAD = 10;
  public static readonly NAME_TAG = 11;
  public static readonly TYPE_TAG = 12;
  public static readonly OB = 13;
  public static readonly CB = 14;
  public static readonly COMMA = 15;
  public static readonly ANY = 16;
  public static readonly CLOSE_COMMENT = 17;
  public static readonly CAST = 18;
  public static readonly COMMENT = 1;

  // tslint:disable:no-trailing-whitespace
  public static readonly channelNames: string[] = [
    'DEFAULT_TOKEN_CHANNEL',
    'HIDDEN',
  ];

  // tslint:disable:no-trailing-whitespace
  public static readonly modeNames: string[] = ['DEFAULT_MODE', 'COMMENT'];

  public static readonly ruleNames: string[] = [
    'QUOT',
    'ID',
    'OPEN_COMMENT',
    'SID',
    'WORD',
    'SPECIAL',
    'EOF_STATEMENT',
    'WSL',
    'STRING',
    'PARAM_MARK',
    'CAST',
    'CID',
    'WS',
    'TRANSFORM_ARROW',
    'SPREAD',
    'NAME_TAG',
    'TYPE_TAG',
    'OB',
    'CB',
    'COMMA',
    'ANY',
    'CLOSE_COMMENT',
  ];

  private static readonly _LITERAL_NAMES: Array<string | undefined> = [
    undefined,
    undefined,
    "'/*'",
    undefined,
    "';'",
    undefined,
    undefined,
    "':'",
    undefined,
    "'->'",
    "'...'",
    "'@name'",
    "'@param'",
    "'('",
    "')'",
    "','",
    undefined,
    "'*/'",
    "'::'",
  ];
  private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
    undefined,
    'ID',
    'OPEN_COMMENT',
    'WORD',
    'EOF_STATEMENT',
    'WSL',
    'STRING',
    'PARAM_MARK',
    'WS',
    'TRANSFORM_ARROW',
    'SPREAD',
    'NAME_TAG',
    'TYPE_TAG',
    'OB',
    'CB',
    'COMMA',
    'ANY',
    'CLOSE_COMMENT',
    'CAST',
  ];
  public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(
    SQLLexer._LITERAL_NAMES,
    SQLLexer._SYMBOLIC_NAMES,
    [],
  );

  // @Override
  // @NotNull
  public get vocabulary(): Vocabulary {
    return SQLLexer.VOCABULARY;
  }
  // tslint:enable:no-trailing-whitespace

  constructor(input: CharStream) {
    super(input);
    this._interp = new LexerATNSimulator(SQLLexer._ATN, this);
  }

  // @Override
  public get grammarFileName(): string {
    return 'SQLLexer.g4';
  }

  // @Override
  public get ruleNames(): string[] {
    return SQLLexer.ruleNames;
  }

  // @Override
  public get serializedATN(): string {
    return SQLLexer._serializedATN;
  }

  // @Override
  public get channelNames(): string[] {
    return SQLLexer.channelNames;
  }

  // @Override
  public get modeNames(): string[] {
    return SQLLexer.modeNames;
  }

  public static readonly _serializedATN: string =
    '\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\x14\x99\b\x01' +
    '\b\x01\x04\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06' +
    '\t\x06\x04\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f' +
    '\x04\r\t\r\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04' +
    '\x12\t\x12\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04' +
    '\x17\t\x17\x03\x02\x03\x02\x03\x03\x03\x03\x07\x035\n\x03\f\x03\x0E\x03' +
    '8\v\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05' +
    '\x03\x05\x03\x06\x06\x06D\n\x06\r\x06\x0E\x06E\x03\x07\x06\x07I\n\x07' +
    '\r\x07\x0E\x07J\x03\x07\x03\x07\x03\b\x03\b\x03\t\x06\tR\n\t\r\t\x0E\t' +
    'S\x03\t\x03\t\x03\n\x03\n\x03\n\x07\n[\n\n\f\n\x0E\n^\v\n\x03\n\x03\n' +
    '\x05\nb\n\n\x03\v\x03\v\x03\f\x03\f\x03\f\x03\f\x03\f\x03\r\x03\r\x03' +
    '\r\x03\r\x03\x0E\x06\x0Ep\n\x0E\r\x0E\x0E\x0Eq\x03\x0E\x03\x0E\x03\x0F' +
    '\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x03\x11\x03\x11\x03\x11' +
    '\x03\x11\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12' +
    '\x03\x12\x03\x13\x03\x13\x03\x14\x03\x14\x03\x15\x03\x15\x03\x16\x06\x16' +
    '\x91\n\x16\r\x16\x0E\x16\x92\x03\x17\x03\x17\x03\x17\x03\x17\x03\x17\x04' +
    '\\\x92\x02\x02\x18\x04\x02\x02\x06\x02\x03\b\x02\x04\n\x02\x02\f\x02\x05' +
    '\x0E\x02\x02\x10\x02\x06\x12\x02\x07\x14\x02\b\x16\x02\t\x18\x02\x14\x1A' +
    '\x02\x02\x1C\x02\n\x1E\x02\v \x02\f"\x02\r$\x02\x0E&\x02\x0F(\x02\x10' +
    '*\x02\x11,\x02\x12.\x02\x13\x04\x02\x03\x07\x05\x02C\\aac|\x06\x022;C' +
    '\\aac|\t\x02#(*1>B]]_`bb}\x80\x05\x02\v\f\x0F\x0F""\x03\x02^^\x02\x9D' +
    '\x02\b\x03\x02\x02\x02\x02\n\x03\x02\x02\x02\x02\f\x03\x02\x02\x02\x02' +
    '\x0E\x03\x02\x02\x02\x02\x10\x03\x02\x02\x02\x02\x12\x03\x02\x02\x02\x02' +
    '\x14\x03\x02\x02\x02\x02\x16\x03\x02\x02\x02\x02\x18\x03\x02\x02\x02\x03' +
    '\x1A\x03\x02\x02\x02\x03\x1C\x03\x02\x02\x02\x03\x1E\x03\x02\x02\x02\x03' +
    ' \x03\x02\x02\x02\x03"\x03\x02\x02\x02\x03$\x03\x02\x02\x02\x03&\x03' +
    '\x02\x02\x02\x03(\x03\x02\x02\x02\x03*\x03\x02\x02\x02\x03,\x03\x02\x02' +
    '\x02\x03.\x03\x02\x02\x02\x040\x03\x02\x02\x02\x062\x03\x02\x02\x02\b' +
    '9\x03\x02\x02\x02\n>\x03\x02\x02\x02\fC\x03\x02\x02\x02\x0EH\x03\x02\x02' +
    '\x02\x10N\x03\x02\x02\x02\x12Q\x03\x02\x02\x02\x14W\x03\x02\x02\x02\x16' +
    'c\x03\x02\x02\x02\x18e\x03\x02\x02\x02\x1Aj\x03\x02\x02\x02\x1Co\x03\x02' +
    '\x02\x02\x1Eu\x03\x02\x02\x02 x\x03\x02\x02\x02"|\x03\x02\x02\x02$\x82' +
    '\x03\x02\x02\x02&\x89\x03\x02\x02\x02(\x8B\x03\x02\x02\x02*\x8D\x03\x02' +
    '\x02\x02,\x90\x03\x02\x02\x02.\x94\x03\x02\x02\x0201\x07)\x02\x021\x05' +
    '\x03\x02\x02\x0226\t\x02\x02\x0235\t\x03\x02\x0243\x03\x02\x02\x0258\x03' +
    '\x02\x02\x0264\x03\x02\x02\x0267\x03\x02\x02\x027\x07\x03\x02\x02\x02' +
    '86\x03\x02\x02\x029:\x071\x02\x02:;\x07,\x02\x02;<\x03\x02\x02\x02<=\b' +
    '\x04\x02\x02=\t\x03\x02\x02\x02>?\x05\x06\x03\x02?@\x03\x02\x02\x02@A' +
    '\b\x05\x03\x02A\v\x03\x02\x02\x02BD\t\x03\x02\x02CB\x03\x02\x02\x02DE' +
    '\x03\x02\x02\x02EC\x03\x02\x02\x02EF\x03\x02\x02\x02F\r\x03\x02\x02\x02' +
    'GI\t\x04\x02\x02HG\x03\x02\x02\x02IJ\x03\x02\x02\x02JH\x03\x02\x02\x02' +
    'JK\x03\x02\x02\x02KL\x03\x02\x02\x02LM\b\x07\x04\x02M\x0F\x03\x02\x02' +
    '\x02NO\x07=\x02\x02O\x11\x03\x02\x02\x02PR\t\x05\x02\x02QP\x03\x02\x02' +
    '\x02RS\x03\x02\x02\x02SQ\x03\x02\x02\x02ST\x03\x02\x02\x02TU\x03\x02\x02' +
    '\x02UV\b\t\x05\x02V\x13\x03\x02\x02\x02Wa\x05\x04\x02\x02Xb\x05\x04\x02' +
    '\x02Y[\v\x02\x02\x02ZY\x03\x02\x02\x02[^\x03\x02\x02\x02\\]\x03\x02\x02' +
    '\x02\\Z\x03\x02\x02\x02]_\x03\x02\x02\x02^\\\x03\x02\x02\x02_`\n\x06\x02' +
    '\x02`b\x05\x04\x02\x02aX\x03\x02\x02\x02a\\\x03\x02\x02\x02b\x15\x03\x02' +
    '\x02\x02cd\x07<\x02\x02d\x17\x03\x02\x02\x02ef\x07<\x02\x02fg\x07<\x02' +
    '\x02gh\x03\x02\x02\x02hi\b\f\x04\x02i\x19\x03\x02\x02\x02jk\x05\x06\x03' +
    '\x02kl\x03\x02\x02\x02lm\b\r\x03\x02m\x1B\x03\x02\x02\x02np\t\x05\x02' +
    '\x02on\x03\x02\x02\x02pq\x03\x02\x02\x02qo\x03\x02\x02\x02qr\x03\x02\x02' +
    '\x02rs\x03\x02\x02\x02st\b\x0E\x05\x02t\x1D\x03\x02\x02\x02uv\x07/\x02' +
    '\x02vw\x07@\x02\x02w\x1F\x03\x02\x02\x02xy\x070\x02\x02yz\x070\x02\x02' +
    'z{\x070\x02\x02{!\x03\x02\x02\x02|}\x07B\x02\x02}~\x07p\x02\x02~\x7F\x07' +
    'c\x02\x02\x7F\x80\x07o\x02\x02\x80\x81\x07g\x02\x02\x81#\x03\x02\x02\x02' +
    '\x82\x83\x07B\x02\x02\x83\x84\x07r\x02\x02\x84\x85\x07c\x02\x02\x85\x86' +
    '\x07t\x02\x02\x86\x87\x07c\x02\x02\x87\x88\x07o\x02\x02\x88%\x03\x02\x02' +
    "\x02\x89\x8A\x07*\x02\x02\x8A'\x03\x02\x02\x02\x8B\x8C\x07+\x02\x02\x8C" +
    ')\x03\x02\x02\x02\x8D\x8E\x07.\x02\x02\x8E+\x03\x02\x02\x02\x8F\x91\v' +
    '\x02\x02\x02\x90\x8F\x03\x02\x02\x02\x91\x92\x03\x02\x02\x02\x92\x93\x03' +
    '\x02\x02\x02\x92\x90\x03\x02\x02\x02\x93-\x03\x02\x02\x02\x94\x95\x07' +
    ',\x02\x02\x95\x96\x071\x02\x02\x96\x97\x03\x02\x02\x02\x97\x98\b\x17\x06' +
    '\x02\x98/\x03\x02\x02\x02\f\x02\x036EJS\\aq\x92\x07\x04\x03\x02\t\x03' +
    '\x02\t\x05\x02\b\x02\x02\x04\x02\x02';
  public static __ATN: ATN;
  public static get _ATN(): ATN {
    if (!SQLLexer.__ATN) {
      SQLLexer.__ATN = new ATNDeserializer().deserialize(
        Utils.toCharArray(SQLLexer._serializedATN),
      );
    }

    return SQLLexer.__ATN;
  }
}
