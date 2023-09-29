import { sql as sourceSql } from '@pgtyped/runtime';

export type notification_type = 'deadline' | 'notification' | 'reminder';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
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
  registration_date: string;
  user_name: string;
}

/** 'GetUsersWithComments' query type */
export interface IGetUsersWithCommentsQuery {
  params: IGetUsersWithCommentsParams;
  result: IGetUsersWithCommentsResult;
}

/** 'SelectExistsQuery' parameters type */
export type ISelectExistsQueryParams = void;

/** 'SelectExistsQuery' return type */
export interface ISelectExistsQueryResult {
  isTransactionExists: boolean | null;
}

/** 'SelectExistsQuery' query type */
export interface ISelectExistsQueryQuery {
  params: ISelectExistsQueryParams;
  result: ISelectExistsQueryResult;
}

/** 'InsertNotifications' parameters type */
export interface IInsertNotificationsParams {
  params: readonly ({
    payload: Json,
    user_id: number,
    type: notification_type
  })[];
}

/** 'InsertNotifications' return type */
export type IInsertNotificationsResult = void;

/** 'InsertNotifications' query type */
export interface IInsertNotificationsQuery {
  params: IInsertNotificationsParams;
  result: IInsertNotificationsResult;
}

/** 'InsertNotification' parameters type */
export interface IInsertNotificationParams {
  notification: {
    payload: Json,
    user_id: number,
    type: notification_type
  };
}

/** 'InsertNotification' return type */
export type IInsertNotificationResult = void;

/** 'InsertNotification' query type */
export interface IInsertNotificationQuery {
  params: IInsertNotificationParams;
  result: IInsertNotificationResult;
}

/** 'GetAllNotifications' parameters type */
export type IGetAllNotificationsParams = void;

/** 'GetAllNotifications' return type */
export interface IGetAllNotificationsResult {
  created_at: string;
  id: number;
  payload: Json;
  type: notification_type;
  user_id: number | null;
}

/** 'GetAllNotifications' query type */
export interface IGetAllNotificationsQuery {
  params: IGetAllNotificationsParams;
  result: IGetAllNotificationsResult;
}

export function sql(s: `SELECT u.* FROM users u
    INNER JOIN book_comments bc ON u.id = bc.user_id
    GROUP BY u.id
    HAVING count(bc.id) > $minCommentCount!::int`): ReturnType<typeof sourceSql<IGetUsersWithCommentsQuery>>;
export function sql(s: `SELECT EXISTS ( SELECT 1 WHERE true ) AS "isTransactionExists"`): ReturnType<typeof sourceSql<ISelectExistsQueryQuery>>;export function sql(s: `INSERT INTO notifications (payload, user_id, type)
values $$params(payload!, user_id!, type!)`): ReturnType<typeof sourceSql<IInsertNotificationsQuery>>;
export function sql(s: `INSERT INTO notifications (payload, user_id, type)
    values $notification(payload!, user_id!, type!)`): ReturnType<typeof sourceSql<IInsertNotificationQuery>>;
export function sql(s: `SELECT * FROM notifications`): ReturnType<typeof sourceSql<IGetAllNotificationsQuery>>;

export function sql(s: string): unknown;
export function sql(s: string): unknown {
  return sourceSql([s] as any);
}
