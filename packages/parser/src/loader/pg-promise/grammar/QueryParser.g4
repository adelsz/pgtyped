parser grammar QueryParser;

options { tokenVocab = QueryLexer; }

input
    : query EOF_STATEMENT? EOF
    ;

query
    : ignored+ (param ignored*)*
    ;

param
    : paramIndexed
    | paramNamed
    ;

ignored: (LINE_COMMENT | ID | FORMATTER_MARK | FORMATTER_SHORT | INTEGER | WORD | STRING | COMMA | OB | CB | SPECIAL)+;

paramNamed: PARAM_MARK OB ID formatter? CB NULLABILITY_MARK?;

paramIndexed: PARAM_MARK INTEGER formatter? NULLABILITY_MARK?;

formatter: (FORMATTER_MARK ID) | FORMATTER_SHORT;
