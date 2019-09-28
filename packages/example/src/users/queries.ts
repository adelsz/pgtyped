import sql from "@pg-typed/query";
import { ISelectAllUsersParams, ISelectAllUsersResult } from "./queries.types";

export const selectAllUsers = sql<ISelectAllUsersResult, ISelectAllUsersParams>`select id, name from users where age in $$ages`;

export const insertUsers = sql`insert into users (name, age) values $users(name, age)`;

export const selectUserIds = sql`select id, note, age from users where id = $id and age = $age`;
