import { sql } from '@pgtyped/query';
import { IInsertNotificationsQuery } from './notifications.types';

// Table order is (user_id, payload, type)
export const insertNotifications = sql<IInsertNotificationsQuery>`
INSERT INTO notifications (payload, user_id, type)
values $$params(payload, user_id, type)
`;
