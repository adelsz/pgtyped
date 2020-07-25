import { sql } from '@pgtyped/query';
import { IGetUsersWithCommentsQuery } from './sample.types';
import { Client } from 'pg';

export async function getUsersWithComment(
  minCommentCount: number,
  client: Client,
) {
  const getUsersWithComments = sql<IGetUsersWithCommentsQuery>`
    SELECT u.* FROM users u
    INNER JOIN book_comments bc ON u.id = bc.user_id
    GROUP BY u.id
    HAVING count(bc.id) > $minCommentCount::int;`;
  const result = await getUsersWithComments.run({ minCommentCount }, client);
  return result[0].user_name;
}
