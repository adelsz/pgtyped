import { sql } from '@pgtyped/runtime';
import {
  IForbiddenInsertUserEmailWithCreatedAtParams,
  IForbiddenInsertUserEmailWithCreatedAtResult,
} from './assert_fail_rbac.types.js';

// This is forbidden since `INSERT` to `created_at` is not granted
const forbiddenInsertUserEmailWithCreatedAt = sql`
  INSERT INTO user_emails (address, receives_notifications, created_at)
  VALUES $userEmail(address, receives_notifications, created_at)
  RETURNING id;`;

const assertForbiddenParamsIsNever: never = null as unknown as IForbiddenInsertUserEmailWithCreatedAtParams;
const assertForbiddenResultIsNever: never = null as unknown as IForbiddenInsertUserEmailWithCreatedAtResult;
