import { sql } from '@pgtyped/runtime';
import {
  IForbiddenInsertUserEmailWithIdParams,
  IForbiddenInsertUserEmailWithIdResult,
} from './assert_fail.types.js';
import {
  IInsertUserEmailParams,
  IInsertUserEmailResult,
} from './sample.types.js';
import { Client } from 'pg';

// This is forbidden since `INSERT` to `created_at` is not permitted
const forbiddenInsertUserEmailWithId = sql`
  INSERT INTO user_emails (address, receives_notifications, created_at)
  VALUES $userEmail(address, receives_notifications, created_at)
  RETURNING id;`;

const assertForbiddenParamsIsNever: never = null as unknown as IForbiddenInsertUserEmailWithIdParams;
const assertForbiddenResultIsNever: never = null as unknown as IForbiddenInsertUserEmailWithIdResult;

// And just to check the above assertions are valid, we would expect these to error:
// @ts-expect-error
const assertRegularParamsIsNever: never = null as unknown as IInsertUserEmailParams;
// @ts-expect-error
const assertRegularResultIsNever: never = null as unknown as IInsertUserEmailResult;
