import { sql } from '@pgtyped/runtime';
import {
  IInsertUserEmailQuery,
  IInsertUserEmailParams,
  IInsertUserEmailResult,
} from './sample.types.js';
import { Client } from 'pg';

export async function insertUserEmail(
  address: string,
  receivesNotifications: boolean,
  client: Client,
) {
  const insertUserEmail = sql<IInsertUserEmailQuery>`
    INSERT INTO user_emails (address, receives_notifications)
    VALUES $userEmail(address, receives_notifications)
    RETURNING id;`;
  const result = await insertUserEmail.run(
    { userEmail: { address, receives_notifications: receivesNotifications } },
    client,
  );
  return result[0];
}

// Just to check the assertions in the `./assert_fail_*` files are valid, we
// would expect these to error:
// @ts-expect-error
const assertRegularParamsIsNever: never = null as unknown as IInsertUserEmailParams;
// @ts-expect-error
const assertRegularResultIsNever: never = null as unknown as IInsertUserEmailResult;
