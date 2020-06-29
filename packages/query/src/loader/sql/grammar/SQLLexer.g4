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

OPEN_COMMENT: '/*' -> mode(COMMENT);
SID: ID -> type(ID);
WORD: [a-zA-Z_0-9]+;
SPECIAL: [\-+*/<>=~!@#%^&|`?$(){},.[\]"]+ -> type(WORD);
EOF_STATEMENT: ';';
WSL     : [ \t\r\n]+ -> skip;
// parse strings and recognize escaped quotes
STRING: QUOT (QUOT | .*? ~([\\]) QUOT);
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
COMMA: ',';
ANY: .+?;
CLOSE_COMMENT: '*/' -> mode(DEFAULT_MODE);
