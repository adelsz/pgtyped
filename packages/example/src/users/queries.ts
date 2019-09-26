const sql = (_: TemplateStringsArray): any => null;

export const SELECT_ALL_USERS = sql`select id, name from users where id in (:agx, :agy)`;

export const SELECT_USER_IDS = sql`select iid from users`;
