/** Types generated for queries found in "./src/users/sample.ts" */

/** 'GetUsersWithComments' parameters type */
export interface IGetUsersWithCommentsParams {
  minCommentCount: number | null | void;
}

/** 'GetUsersWithComments' return type */
export interface IGetUsersWithCommentsResult {
  id: number;
  email: string;
  user_name: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  registration_date: Date;
}

/** 'GetUsersWithComments' query type */
export interface IGetUsersWithCommentsQuery {
  params: IGetUsersWithCommentsParams;
  result: IGetUsersWithCommentsResult;
}

