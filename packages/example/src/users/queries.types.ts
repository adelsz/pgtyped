/** Types generated for queries found in "src/users/queries.ts" */

/** 'selectAllUsers' parameters type */
export interface ISelectAllUsersParams {
  ages: Array<number | null>;
}

/** 'selectAllUsers' return type */
export interface ISelectAllUsersResult {
  id: number;
  name: string | null;
}


/** 'insertUsers' parameters type */
export interface IInsertUsersParams {
  users: {
    name: string,
    age: number
  };
}

/** 'insertUsers' return type */
export interface IInsertUsersResult {
  id: number;
  name: string | null;
}


/** 'selectUserIds' parameters type */
export interface ISelectUserIdsParams {
  id: number | null;
  age: number | null;
}

/** 'selectUserIds' return type */
export interface ISelectUserIdsResult {
  id: number;
}


