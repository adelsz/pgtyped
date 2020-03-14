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

/** 'selectAllUsers' query type */
export interface ISelectAllUsersQuery {
  params: ISelectAllUsersParams;
  result: ISelectAllUsersResult;
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
  id: number;
  name: string | null;
}

/** 'insertUsers' query type */
export interface IInsertUsersQuery {
  params: IInsertUsersParams;
  result: IInsertUsersResult;
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

/** 'selectUserIds' query type */
export interface ISelectUserIdsQuery {
  params: ISelectUserIdsParams;
  result: ISelectUserIdsResult;
}
