import { Client, QueryResult } from 'pg';
import { insertBooks, getBooksByAuthorName } from './books/books.queries';
import {
  sendNotifications,
  thresholdFrogs,
} from './notifications/notifications.queries';
// tslint:disable:no-console

export const client = new Client({
  host: 'localhost',
  user: 'test',
  password: 'example',
  database: 'test',
  port: 5432,
});

async function main() {
  await client.connect();
  const books = await getBooksByAuthorName.run(
    {
      authorName: 'Carl Sagan',
    },
    client,
  );
  console.log(`Book name: ${books[0].name}`);

  const [{ book_id: insertedBookId }] = await insertBooks.run(
    {
      books: [
        {
          authorId: 1,
          name: 'A Brief History of Time: From the Big Bang to Black Holes',
          rank: 1,
        },
      ],
    },
    client,
  );
  console.log(`Inserted book ID: ${insertedBookId}`);

  await sendNotifications.run(
    { notifications: [{ user_id: 2, payload: { num_frogs: 82 } }] },
    client,
  );

  const notifications = await thresholdFrogs.run({ numFrogs: 80 }, client);

  console.log(notifications);

  await client.end();
}

main();
