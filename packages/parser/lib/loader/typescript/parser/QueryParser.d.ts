import { ATN } from "antlr4ts/atn/ATN.js";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException.js";
import { Parser } from "antlr4ts/Parser.js";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext.js";
import { TerminalNode } from "antlr4ts/tree/TerminalNode.js";
import { TokenStream } from "antlr4ts/TokenStream.js";
import { Vocabulary } from "antlr4ts/Vocabulary.js";
import { QueryParserListener } from "./QueryParserListener.js";
import { QueryParserVisitor } from "./QueryParserVisitor.js";
export declare class QueryParser extends Parser {
    static readonly ID = 1;
    static readonly SINGULAR_PARAM_MARK = 2;
    static readonly PLURAL_PARAM_MARK = 3;
    static readonly COMMA = 4;
    static readonly OB = 5;
    static readonly CB = 6;
    static readonly WORD = 7;
    static readonly REQUIRED_MARK = 8;
    static readonly SPECIAL = 9;
    static readonly EOF_STATEMENT = 10;
    static readonly WSL = 11;
    static readonly STRING = 12;
    static readonly RULE_input = 0;
    static readonly RULE_query = 1;
    static readonly RULE_param = 2;
    static readonly RULE_ignored = 3;
    static readonly RULE_scalarParam = 4;
    static readonly RULE_pickParam = 5;
    static readonly RULE_arrayPickParam = 6;
    static readonly RULE_arrayParam = 7;
    static readonly RULE_scalarParamName = 8;
    static readonly RULE_paramName = 9;
    static readonly RULE_pickKey = 10;
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
    param(): ParamContext;
    ignored(): IgnoredContext;
    scalarParam(): ScalarParamContext;
    pickParam(): PickParamContext;
    arrayPickParam(): ArrayPickParamContext;
    arrayParam(): ArrayParamContext;
    scalarParamName(): ScalarParamNameContext;
    paramName(): ParamNameContext;
    pickKey(): PickKeyContext;
    static readonly _serializedATN: string;
    static __ATN: ATN;
    static get _ATN(): ATN;
}
export declare class InputContext extends ParserRuleContext {
    query(): QueryContext;
    EOF(): TerminalNode;
    EOF_STATEMENT(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class QueryContext extends ParserRuleContext {
    ignored(): IgnoredContext[];
    ignored(i: number): IgnoredContext;
    param(): ParamContext[];
    param(i: number): ParamContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class ParamContext extends ParserRuleContext {
    pickParam(): PickParamContext | undefined;
    arrayPickParam(): ArrayPickParamContext | undefined;
    scalarParam(): ScalarParamContext | undefined;
    arrayParam(): ArrayParamContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class IgnoredContext extends ParserRuleContext {
    ID(): TerminalNode[];
    ID(i: number): TerminalNode;
    WORD(): TerminalNode[];
    WORD(i: number): TerminalNode;
    STRING(): TerminalNode[];
    STRING(i: number): TerminalNode;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    OB(): TerminalNode[];
    OB(i: number): TerminalNode;
    CB(): TerminalNode[];
    CB(i: number): TerminalNode;
    SPECIAL(): TerminalNode[];
    SPECIAL(i: number): TerminalNode;
    REQUIRED_MARK(): TerminalNode[];
    REQUIRED_MARK(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class ScalarParamContext extends ParserRuleContext {
    SINGULAR_PARAM_MARK(): TerminalNode;
    scalarParamName(): ScalarParamNameContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class PickParamContext extends ParserRuleContext {
    SINGULAR_PARAM_MARK(): TerminalNode;
    paramName(): ParamNameContext;
    OB(): TerminalNode;
    pickKey(): PickKeyContext[];
    pickKey(i: number): PickKeyContext;
    CB(): TerminalNode;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class ArrayPickParamContext extends ParserRuleContext {
    PLURAL_PARAM_MARK(): TerminalNode;
    paramName(): ParamNameContext;
    OB(): TerminalNode;
    pickKey(): PickKeyContext[];
    pickKey(i: number): PickKeyContext;
    CB(): TerminalNode;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class ArrayParamContext extends ParserRuleContext {
    PLURAL_PARAM_MARK(): TerminalNode;
    scalarParamName(): ScalarParamNameContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class ScalarParamNameContext extends ParserRuleContext {
    ID(): TerminalNode;
    REQUIRED_MARK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class ParamNameContext extends ParserRuleContext {
    ID(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
export declare class PickKeyContext extends ParserRuleContext {
    ID(): TerminalNode;
    REQUIRED_MARK(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    get ruleIndex(): number;
    enterRule(listener: QueryParserListener): void;
    exitRule(listener: QueryParserListener): void;
    accept<Result>(visitor: QueryParserVisitor<Result>): Result;
}
