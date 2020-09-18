import { Client } from 'pg';
import {
  getBooksByAuthorName,
  insertBooks,
  updateBooks,
  updateBooksCustom,
} from './books/books.queries';
import { getAllComments } from './comments/comments.queries';
import {
  insertNotification,
  insertNotifications,
} from './notifications/notifications';
import {
  sendNotifications,
  thresholdFrogs,
} from './notifications/notifications.queries';

// tslint:disable:no-console

const dbConfig = {
  host: process.env.PGHOST ?? '127.0.0.1',
  user: process.env.PGUSER ?? 'postgres',
  password: process.env.PGPASSWORD ?? 'password',
  database: process.env.PGDATABASE ?? 'postgres',
  port: (process.env.PGPORT ? Number(process.env.PGPORT) : undefined) ?? 5432,
};

export const client = new Client(dbConfig);

async function main() {
  await client.connect();

  const comments = await getAllComments.run({ id: 1 }, client);
  console.log(`Comments: ${JSON.stringify(comments)}`);

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

  await updateBooks.run({ id: 2, rank: 12, name: 'Another title' }, client);

  await updateBooksCustom.run({ id: 2, rank: 13 }, client);

  const books = await getBooksByAuthorName.run(
    {
      authorName: 'Carl Sagan',
    },
    client,
  );
  console.log(`Book: ${JSON.stringify(books[0])}`);

  await sendNotifications.run(
    {
      notifications: [
        {
          user_id: 2,
          payload: { num_frogs: 82 },
          type: 'reminder',
        },
      ],
    },
    client,
  );
  await insertNotifications.run(
    {
      params: [
        {
          user_id: 1,
          payload: { num_frogs: 1002 },
          type: 'reminder',
        },
      ],
    },
    client,
  );
  await insertNotification.run(
    {
      notification: {
        user_id: 1,
        payload: { num_frogs: 1002 },
        type: 'reminder',
      },
    },
    client,
  );

  const notifications = await thresholdFrogs.run({ numFrogs: 80 }, client);

  console.log(notifications);

  await client.end();
}

main()
  .then(() => console.log('Successfully ran example code!'))
  .catch((err) => {
    console.error(`Error running example code: ${err.stack}`);
    process.exit(1);
  });
