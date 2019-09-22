const sql = (_: TemplateStringsArray): any => null;

export const SELECT_ALL_USERS = sql`select name from users`;

export const SELECT_USER_IDS = sql`select iid from users`;
