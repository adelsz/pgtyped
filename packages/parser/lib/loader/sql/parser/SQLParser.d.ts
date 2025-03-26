import { ATN } from "antlr4ts/atn/ATN.js";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException.js";
import { Parser } from "antlr4ts/Parser.js";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import { TerminalNode } from "antlr4ts/tree/TerminalNode.js";
import { TokenStream } from "antlr4ts/TokenStream.js";
import { Vocabulary } from "antlr4ts/Vocabulary.js";
import { SQLParserListener } from "./SQLParserListener.js";
import { SQLParserVisitor } from "./SQLParserVisitor.js";
export declare class SQLParser extends Parser {
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
    static readonly RULE_input = 0;
    static readonly RULE_query = 1;
    static readonly RULE_queryDef = 2;
    static readonly RULE_ignoredComment = 3;
    static readonly RULE_statement = 4;
    static readonly RULE_statementBody = 5;
    static readonly RULE_word = 6;
    static readonly RULE_range = 7;
    static readonly RULE_param = 8;
    static readonly RULE_paramId = 9;
    static readonly RULE_nameTag = 10;
    static readonly RULE_paramTag = 11;
    static readonly RULE_paramTransform = 12;
    static readonly RULE_transformRule = 13;
    static readonly RULE_spreadTransform = 14;
    static readonly RULE_pickTransform = 15;
    static readonly RULE_spreadPickTransform = 16;
    static readonly RULE_key = 17;
    static readonly RULE_queryName = 18;
    static readonly RULE_paramName = 19;
    static readonly ruleNames: string[];
    private static readonly _LITERAL_NAMES;
    private static readonly _SYMBOLIC_NAMES;
    static readonly VOCABULARY: Vocabulary;
    get vocabulary(): Vocabulary;
    get grammarFileName(): string;
    get ruleNames(): string[];
    get serializedATN(): string;
    protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException;
    constructor(input: TokenStream);
    input(): InputContext;
    query(): QueryContext;
    queryDef(): QueryDefContext;
    ignoredComment(): IgnoredCommentContext;
    statement(): StatementContext;
    statementBody(): StatementBodyContext;
    word(): WordContext;
    range(): RangeContext;
    param(): ParamContext;
    paramId(): ParamIdContext;
    nameTag(): NameTagContext;
    paramTag(): ParamTagContext;
    paramTransform(): ParamTransformContext;
    transformRule(): TransformRuleContext;
    spreadTransform(): SpreadTransformContext;
    pickTransform(): PickTransformContext;
    spreadPickTransform(): SpreadPickTransformContext;
    key(): KeyContext;
    queryName(): QueryNameContext;
    paramName(): ParamNameContext;
    static readonly _serializedATN: string;
    static __ATN: ATN;
    static get _ATN(): ATN;
}
export declare class InputContext extends ParserRuleContext {
    EOF(): TerminalNode;
    query(): QueryContext[];
    query(i: number): QueryContext;
    ignoredComment(): IgnoredCommentContext[];
    ignoredComment(i: number): IgnoredCommentContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class QueryContext extends ParserRuleContext {
    queryDef(): QueryDefContext;
    statement(): StatementContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class QueryDefContext extends ParserRuleContext {
    OPEN_COMMENT(): TerminalNode;
    nameTag(): NameTagContext;
    CLOSE_COMMENT(): TerminalNode;
    paramTag(): ParamTagContext[];
    paramTag(i: number): ParamTagContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class IgnoredCommentContext extends ParserRuleContext {
    OPEN_COMMENT(): TerminalNode;
    CLOSE_COMMENT(): TerminalNode[];
    CLOSE_COMMENT(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class StatementContext extends ParserRuleContext {
    statementBody(): StatementBodyContext;
    EOF_STATEMENT(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class StatementBodyContext extends ParserRuleContext {
    LINE_COMMENT(): TerminalNode[];
    LINE_COMMENT(i: number): TerminalNode;
    ignoredComment(): IgnoredCommentContext[];
    ignoredComment(i: number): IgnoredCommentContext;
    param(): ParamContext[];
    param(i: number): ParamContext;
    word(): WordContext[];
    word(i: number): WordContext;
    range(): RangeContext[];
    range(i: number): RangeContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class WordContext extends ParserRuleContext {
    WORD(): TerminalNode | undefined;
    ID(): TerminalNode | undefined;
    STRING(): TerminalNode | undefined;
    S_REQUIRED_MARK(): TerminalNode | undefined;
    DOLLAR_STRING(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class RangeContext extends ParserRuleContext {
    PARAM_MARK(): TerminalNode;
    word(): WordContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class ParamContext extends ParserRuleContext {
    PARAM_MARK(): TerminalNode;
    paramId(): ParamIdContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class ParamIdContext extends ParserRuleContext {
    ID(): TerminalNode;
    S_REQUIRED_MARK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class NameTagContext extends ParserRuleContext {
    NAME_TAG(): TerminalNode;
    queryName(): QueryNameContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class ParamTagContext extends ParserRuleContext {
    TYPE_TAG(): TerminalNode;
    paramName(): ParamNameContext;
    paramTransform(): ParamTransformContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class ParamTransformContext extends ParserRuleContext {
    TRANSFORM_ARROW(): TerminalNode;
    transformRule(): TransformRuleContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class TransformRuleContext extends ParserRuleContext {
    spreadTransform(): SpreadTransformContext | undefined;
    pickTransform(): PickTransformContext | undefined;
    spreadPickTransform(): SpreadPickTransformContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class SpreadTransformContext extends ParserRuleContext {
    OB(): TerminalNode;
    SPREAD(): TerminalNode;
    CB(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class PickTransformContext extends ParserRuleContext {
    OB(): TerminalNode;
    key(): KeyContext[];
    key(i: number): KeyContext;
    CB(): TerminalNode;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class SpreadPickTransformContext extends ParserRuleContext {
    OB(): TerminalNode;
    pickTransform(): PickTransformContext;
    SPREAD(): TerminalNode;
    CB(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class KeyContext extends ParserRuleContext {
    ID(): TerminalNode;
    C_REQUIRED_MARK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class QueryNameContext extends ParserRuleContext {
    ID(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
export declare class ParamNameContext extends ParserRuleContext {
    ID(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: SQLParserListener): void;
    exitRule(listener: SQLParserListener): void;
    accept<Result>(visitor: SQLParserVisitor<Result>): Result;
}
