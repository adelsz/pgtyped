/** Types generated for queries found in "src/users/sample.ts" */

/** 'GetUsersWithComments' parameters type */
export interface IGetUsersWithCommentsParams {
  minCommentCount: number;
}

/** 'GetUsersWithComments' return type */
export interface IGetUsersWithCommentsResult {
  /** Age (in years) */
  age: number | null;
  email: string;
  first_name: string | null;
  id: number;
  last_name: string | null;
  registration_date: Date;
  user_name: string;
}

/** 'GetUsersWithComments' query type */
export interface IGetUsersWithCommentsQuery {
  params: IGetUsersWithCommentsParams;
  result: IGetUsersWithCommentsResult;
}

