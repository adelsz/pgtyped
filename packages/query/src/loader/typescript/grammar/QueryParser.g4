parser grammar QueryParser;

options { tokenVocab = QueryLexer; }

input
    : query EOF_STATEMENT? EOF
    ;

query
    : ignored (param | hintedColumnAliasName | ignored)*
    ;

param
    : pickParam
    | arrayPickParam
    | scalarParam
    | arrayParam
    ;

ignored: (ID | WORD | STRING | COMMA | OB | CB | SPECIAL | REQUIRED_MARK | OPTIONAL_MARK | AS | DOUBLE_QUOTE);

scalarParam: SINGULAR_PARAM_MARK scalarParamName;

pickParam: SINGULAR_PARAM_MARK paramName OB pickKey (COMMA pickKey)* COMMA? CB;

arrayPickParam: PLURAL_PARAM_MARK paramName OB pickKey (COMMA pickKey)* COMMA? CB;

arrayParam: PLURAL_PARAM_MARK scalarParamName;

scalarParamName: ID REQUIRED_MARK?;

paramName: ID;

pickKey: ID REQUIRED_MARK?;

hintedColumnAliasName: AS DOUBLE_QUOTE ID (REQUIRED_MARK | OPTIONAL_MARK) DOUBLE_QUOTE;
