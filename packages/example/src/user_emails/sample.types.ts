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

