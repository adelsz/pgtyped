parser grammar QueryParser;

options { tokenVocab = QueryLexer; }

input
    : query EOF_STATEMENT? EOF
    ;

query
    : ignored+ (param ignored*)*
    ;

ignored: (ID | WORD | STRING | COMMA | OB | CB | SPECIAL)+;

param
    : pickParam
    | arrayPickParam
    | scalarParam
    | arrayParam
    ;

scalarParam: SINGULAR_PARAM_MARK paramName;

pickParam: SINGULAR_PARAM_MARK paramName OB pickKey (COMMA pickKey)* COMMA? CB;

arrayPickParam: PLURAL_PARAM_MARK paramName OB pickKey (COMMA pickKey)* COMMA? CB;

arrayParam: PLURAL_PARAM_MARK paramName;

paramName: ID;

pickKey: ID;
