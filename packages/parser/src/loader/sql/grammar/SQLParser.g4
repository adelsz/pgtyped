parser grammar SQLParser;

options { tokenVocab = SQLLexer; }

input
    : (ignoredComment* query)+ EOF
    ;

query
    : queryDef statement
    ;

queryDef: OPEN_COMMENT nameTag paramTag* CLOSE_COMMENT;

ignoredComment
    : OPEN_COMMENT (~CLOSE_COMMENT)* CLOSE_COMMENT;

statement
    : statementBody EOF_STATEMENT;

statementBody
    : (LINE_COMMENT | ignoredComment | param | word | range)*;

word: WORD | ID | STRING | S_REQUIRED_MARK | DOLLAR_STRING;

// required to avoid errors when matching strings like "[1:2]" as params
range: PARAM_MARK word;

param: PARAM_MARK paramId;

paramId: ID S_REQUIRED_MARK?;

nameTag: NAME_TAG queryName;

paramTag: TYPE_TAG paramName paramTransform;

paramTransform: TRANSFORM_ARROW transformRule;

transformRule
    : spreadTransform
    | pickTransform
    | spreadPickTransform;

spreadTransform: OB SPREAD CB;

pickTransform: OB key (COMMA key)* COMMA? CB;

spreadPickTransform: OB pickTransform SPREAD CB;

key: ID C_REQUIRED_MARK?;

queryName: ID;
paramName: ID;
