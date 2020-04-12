import { sql } from '@pgtyped/query';

import {
  IInsertUsersQuery,
  ISelectAllUsersQuery,
  ISelectUserIdsQuery,
} from './queries.types';

export const selectAllUsers = sql<
  ISelectAllUsersQuery
>`select id, name from users where age in $$ages`;

export const insertUsers = sql<
  IInsertUsersQuery
>`insert into users (name, age) values $users(name, age) returning id, name`;

export const selectUserIds = sql<
  ISelectUserIdsQuery
>`select id from users where id = $id and age = $age`;
