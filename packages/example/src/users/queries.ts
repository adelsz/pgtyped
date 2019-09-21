const sql = (_: TemplateStringsArray) => null;

export const SELECT_ALL_USERS = sql`select * from users`;

export const SELECT_USER_IDS = sql`select iid from users`;
