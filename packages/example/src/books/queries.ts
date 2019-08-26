const sql = (_: TemplateStringsArray) => null;

const SELECT_ALL_BOOKS = sql`select * from books`;

const DELETE_BOOKS = sql`delete from books * where id = :id`;