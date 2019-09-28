/** Types generated for queries found in "./src/users/queries.ts" */

/** 'selectAllUsers' parameters type */
export interface ISelectAllUsersParams {
  ages: Array<number | null>;
}

/** 'selectAllUsers' return type */
export interface ISelectAllUsersResult {
  id: string;
  name: string;
}

/** 'insertUsers' parameters type */
export interface IInsertUsersParams {
  users: {
    name: string,
    age: number,
  };
}

/** 'insertUsers' return type */
export interface IInsertUsersResult {
  id: string;
  name: string;
}

/** 'selectUserIds' parameters type */
export interface ISelectUserIdsParams {
  id: string | null;
  age: number | null;
}

/** 'selectUserIds' return type */
export interface ISelectUserIdsResult {
  id: string;
}
