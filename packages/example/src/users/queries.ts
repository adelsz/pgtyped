const sql = (_: TemplateStringsArray): any => null;

export const SELECT_ALL_USERS = sql`select id, name from users where age in ::ages`;

export const INSERT_USERS = sql`insert into users (name, age) values :users(:name, :age)`;

export const SELECT_USER_IDS = sql`select id, note, age from users where id = :id and age = :age`;
