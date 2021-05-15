parser grammar QueryParser;

options { tokenVocab = QueryLexer; }

input
    : query EOF_STATEMENT? EOF
    ;

query
    : ignored+ (param ignored*)*
    ;

param
    : pickParam
    | arrayPickParam
    | scalarParam
    | arrayParam
    ;

ignored: (ID | WORD | STRING | COMMA | OB | CB | SPECIAL | REQUIRED_MARK)+;

scalarParam: SINGULAR_PARAM_MARK scalarParamName;

pickParam: SINGULAR_PARAM_MARK paramName OB pickKey (COMMA pickKey)* COMMA? CB;

arrayPickParam: PLURAL_PARAM_MARK paramName OB pickKey (COMMA pickKey)* COMMA? CB;

arrayParam: PLURAL_PARAM_MARK paramName;

scalarParamName: ID REQUIRED_MARK?;

paramName: ID;

pickKey: ID REQUIRED_MARK?;
