/*
-- @name GetAllUsers
-- @param userNames -> (...)
-- @param user -> (name,age)
-- @param users -> ((name,age)...)
select * from $userNames;
select * from $books $filterById;
*/

lexer grammar QueryLexer;

tokens { ID }

fragment QUOT: '\'';
fragment ID: [a-zA-Z_][a-zA-Z_0-9]*;

AS: ('as' | 'AS');
SID: ID -> type(ID);
SINGULAR_PARAM_MARK: '$';
PLURAL_PARAM_MARK: '$$';
COMMA: ',';
OB: '(';
CB: ')';
WORD: [a-zA-Z_0-9]+;
REQUIRED_MARK: '!';
OPTIONAL_MARK: '?';
DOUBLE_QUOTE: '"';
SPECIAL: [\-+*/<>=~@#%^&|`${}.[\]:]+;
EOF_STATEMENT: ';';
WSL     : [ \t\r\n]+ -> skip;
// parse strings and recognize escaped quotes
STRING: QUOT (QUOT | .*? ~([\\]) QUOT);
