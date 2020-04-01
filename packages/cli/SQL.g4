grammar SQL;

fragment SPECIAL: [{}*];
NL     : '\n';
WS     : [ \t\r]+ -> skip;
WORD   : [a-zA-Z_0-9{}*$=]+;
STATEMENT: WORD (WORD|WS)+;
ONE_LINE_COMMENT_PREFIX: '--';

NAME_TAG  :  '@name';
TYPE_TAG  :  '@param';

input
    : query+ EOF
    ;

query
    : nameComment paramComment* statement
    ;

statement
    : statementBody ';' NL;

statementBody
    : STATEMENT;

nameComment: ONE_LINE_COMMENT_PREFIX nameTag NL;

paramComment: ONE_LINE_COMMENT_PREFIX typeTag NL;

nameTag: NAME_TAG nameValue;

typeTag: TYPE_TAG typeValue;

nameValue: WORD;
typeValue: WORD;
