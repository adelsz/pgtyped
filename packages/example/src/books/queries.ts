const sql = (_: TemplateStringsArray) => null;

export const SELECT_ALL_BOOKS = sql`select * from books`;

export const DELETE_BOOKS = sql`delete from books * where id = $id`;
