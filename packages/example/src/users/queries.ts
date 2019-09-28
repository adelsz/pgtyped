import sql from "@pgtyped/query";

import {
  ISelectAllUsersParams, ISelectAllUsersResult,
  IInsertUsersParams, IInsertUsersResult,
  ISelectUserIdsParams, ISelectUserIdsResult,
} from "./queries.types";

export const selectAllUsers = sql<
  ISelectAllUsersResult, ISelectAllUsersParams
  >`select id, name from users where age in $$ages`;

export const insertUsers = sql<
  IInsertUsersResult, IInsertUsersParams
  >`insert into users (name, age) values $users(name, age) returning id, name`;

export const selectUserIds = sql<
  ISelectUserIdsResult, ISelectUserIdsParams
  >`select id from users where id = $id and age = $age`;
