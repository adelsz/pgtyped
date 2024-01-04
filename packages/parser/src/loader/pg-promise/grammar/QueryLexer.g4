lexer grammar QueryLexer;

tokens { ID, INTEGER }

fragment QUOT: '\'';
fragment ID: [a-zA-Z_][a-zA-Z_0-9]*;
fragment INTEGER: [0-9]+;
fragment NOT_LF: ~'\n';

SID: ID -> type(ID);
SINTEGER: INTEGER -> type(INTEGER);
PARAM_MARK: '$';
COMMA: ',';
OB: '(';
CB: ')';
NULLABILITY_MARK: '/*nullable*/';
FORMATTER_MARK: ':';
FORMATTER_SHORT: [#^~];
LINE_COMMENT: '--' NOT_LF*;
WORD: [a-zA-Z_0-9]+;
SPECIAL: [\-+*/'<>!=~@#%^&|`?{}.[\]":åäöÅÄÖ]+;
EOF_STATEMENT: ';';
WSL     : [ \t\r\n]+ -> skip;
// parse strings and recognize escaped quotes
STRING: QUOT (QUOT | NOT_LF*? ~([\\]) QUOT);
