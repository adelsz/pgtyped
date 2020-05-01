/** Types generated for queries found in "src/users/sample.ts" */

/** 'getUsersWithComments' parameters type */
export interface IGetUsersWithCommentsParams {
  minCommentCount: number | null | void;
}

/** 'getUsersWithComments' return type */
export interface IGetUsersWithCommentsResult {
  id: number;
  email: string;
  user_name: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  registration_date: Date;
}

/** 'getUsersWithComments' query type */
export interface IGetUsersWithCommentsQuery {
  params: IGetUsersWithCommentsParams;
  result: IGetUsersWithCommentsResult;
}

