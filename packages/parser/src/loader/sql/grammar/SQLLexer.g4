/*
-- @name GetAllUsers
-- @param userNames -> (...)
-- @param user -> (name,age)
-- @param users -> ((name,age)...)
select * from $userNames;
select * from $books $filterById;
*/

lexer grammar SQLLexer;

tokens { ID }

fragment QUOT: '\'';
fragment ID: [a-zA-Z_][a-zA-Z_0-9]*;

LINE_COMMENT: '--' ~[\r\n]* '\r'? '\n';
OPEN_COMMENT: '/*' -> mode(COMMENT);
SID: ID -> type(ID);
S_REQUIRED_MARK: '!';
WORD: [a-zA-Z_0-9]+;
SPECIAL: [\-+*/<>=~@#%^&|`?(){},.[\]"]+ -> type(WORD);
DOLLAR: '$' -> type(WORD);
EOF_STATEMENT: ';';
WSL     : [ \t\r\n]+ -> skip;
// parse strings and recognize escaped quotes
STRING: QUOT (QUOT | .*? ~([\\]) QUOT);
DOLLAR_STRING: DOLLAR WORD? DOLLAR .* DOLLAR WORD? DOLLAR;
PARAM_MARK: ':';
CAST: '::' -> type(WORD);

mode COMMENT;
CID: ID -> type(ID);
WS     : [ \t\r\n]+ -> skip;
TRANSFORM_ARROW: '->';
SPREAD: '...';
NAME_TAG  :  '@name';
TYPE_TAG  :  '@param';
OB: '(';
CB: ')';
OPEN_ARRAY: 'ARRAY[';
CLOSE_ARRAY: ']';
COMMA: ',';
C_REQUIRED_MARK: '!';
ANY: .+?;
CLOSE_COMMENT: '*/' -> mode(DEFAULT_MODE);
