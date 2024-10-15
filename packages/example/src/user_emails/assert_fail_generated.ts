import { sql } from '@pgtyped/runtime';
import {
  IForbiddenInsertUserEmailWithIdParams,
  IForbiddenInsertUserEmailWithIdResult,
} from './assert_fail_generated.types.js';
import { Client } from 'pg';

// This is invalid since `id` is a generated column
const forbiddenInsertUserEmailWithId = sql`
  INSERT INTO user_emails (id, address, receives_notifications)
  VALUES $userEmail(id, address, receives_notifications)
  RETURNING id;`;

const assertForbiddenParamsIsNever: never = null as unknown as IForbiddenInsertUserEmailWithIdParams;
const assertForbiddenResultIsNever: never = null as unknown as IForbiddenInsertUserEmailWithIdResult;
