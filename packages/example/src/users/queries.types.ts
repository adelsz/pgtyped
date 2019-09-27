/** Types generated for queries found in "./src/users/queries.ts" */

/** 'SELECT_ALL_USERS' parameters type */
export interface ISelectAllUsersParams {
  ages: Array<number | null>;
}

/** 'SELECT_ALL_USERS' return type */
export interface ISelectAllUsersResult {
  id: string;
  name: string;
}

/** 'INSERT_USERS' parameters type */
export interface IInsertUsersParams {
  users: {
    name: string,
    age: number,
  };
}

/** 'INSERT_USERS' return type */
export type IInsertUsersResult = void;

/** 'SELECT_USER_IDS' parameters type */
export interface ISelectUserIdsParams {
  id: string | null;
  age: number | null;
}

/** 'SELECT_USER_IDS' return type */
export interface ISelectUserIdsResult {
  id: string;
  note: string | null;
  age: number;
}
