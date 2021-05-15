parser grammar SQLParser;

options {
	tokenVocab = SQLLexer;
}

input: (ignoredComment* query)+ EOF;

query: queryDef statement;

queryDef: OPEN_COMMENT nameTag paramTag* CLOSE_COMMENT;

ignoredComment: OPEN_COMMENT (~NAME_TAG)*? CLOSE_COMMENT;

statement: statementBody EOF_STATEMENT;

statementBody: word (ignoredComment | param | word)*;

word: WORD | ID | STRING;

param: PARAM_MARK paramId;

paramId: ID S_REQUIRED_MARK?;

nameTag: NAME_TAG queryName;

paramTag: TYPE_TAG paramName paramTransform;

paramTransform: TRANSFORM_ARROW transformRule;

transformRule:
	spreadTransform
	| pickTransform
	| spreadPickTransform;

spreadTransform: OB SPREAD C_REQUIRED_MARK? CB;

pickTransform: OB key (COMMA key)* COMMA? CB;

spreadPickTransform: OB pickTransform SPREAD CB;

key: ID C_REQUIRED_MARK?;

queryName: ID;
paramName: ID;
