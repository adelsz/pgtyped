/** Types generated for queries found in "src/user_emails/sample.ts" */

/** 'InsertUserEmail' parameters type */
export interface IInsertUserEmailParams {
  userEmail: {
    address: string | null | void,
    receives_notifications: boolean | null | void
  };
}

/** 'InsertUserEmail' return type */
export interface IInsertUserEmailResult {
  id: number;
}

/** 'InsertUserEmail' query type */
export interface IInsertUserEmailQuery {
  params: IInsertUserEmailParams;
  result: IInsertUserEmailResult;
}

/** Query 'ForbiddenInsertUserEmailWithId' is invalid, so its result is assigned type 'never'.
 *  */
export type IForbiddenInsertUserEmailWithIdResult = never;

/** Query 'ForbiddenInsertUserEmailWithId' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IForbiddenInsertUserEmailWithIdParams = never;

