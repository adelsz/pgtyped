/* @name GetNotifications */
SELECT *
FROM notifications
WHERE user_id = :userId;

/*
  @name SendNotifications
  @param notifications -> ((user_id, payload)...)
*/
INSERT INTO notifications (user_id, payload)
VALUES :notifications RETURNING id as notification_id;

/*
  @name ThresholdFrogs
*/
SELECT u.user_name, n.payload
FROM notifications n
INNER JOIN users u on n.user_id = u.id
WHERE CAST (n.payload->'num_frogs' AS int) > :numFrogs;

