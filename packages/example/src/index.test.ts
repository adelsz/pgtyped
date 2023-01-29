import {test, expect, afterEach, beforeEach, beforeAll, describe} from '@jest/globals';
import pg from 'pg';
const {Client} = pg;
import {
    aggregateEmailsAndTest,
    findBookUnicode,
    findBookById,
    getBooksByAuthorName,
    insertBooks,
    updateBooks,
    updateBooksCustom,
    updateBooksRankNotNull,
    findBookNameOrRank, getBooks,
} from './books/books.queries.js';
import {getAllComments, insertComment} from './comments/comments.queries.js';
import {
  insertNotification,
  insertNotifications,
} from './notifications/notifications.js';
import {
    getNotifications,
    sendNotifications,
    thresholdFrogs,
} from './notifications/notifications.queries.js';
import {getUsersWithComment} from "./users/sample.js";

const dbConfig = {
  host: process.env.PGHOST ?? '127.0.0.1',
  user: process.env.PGUSER ?? 'postgres',
  password: process.env.PGPASSWORD ?? 'password',
  database: process.env.PGDATABASE ?? 'postgres',
  port: (process.env.PGPORT ? Number(process.env.PGPORT) : undefined) ?? 5432,
};

// Connect to the database once before all tests
let client: pg.Client;
beforeAll(async () => {
    // Parse dates as strings for demo and testing purposes
    pg.types.setTypeParser(pg.types.builtins.DATE, function(val) {
        return val;
    })

    // Create a new client and connect to the database
    client = new Client(dbConfig);
    await client.connect();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await client.end();
})

// Run each test in a transaction that is rolled back at the end
beforeEach( () => client.query('BEGIN'))
afterEach( () => client.query('ROLLBACK'))

test('select query with unicode characters', () => {
    const result = findBookUnicode.run(undefined, client);
    expect(result).resolves.toMatchSnapshot();
})

test('select query with parameters', async () => {
    const comments = await getAllComments.run({ id: 1 }, client);
    expect(comments).toMatchSnapshot();
})

test('select query with dynamic or', () => {
    const result = findBookNameOrRank.run({
        rank: 1,
    }, client);
    expect(result).resolves.toMatchSnapshot();
})

test('select query with date type override (TS)', async () => {
    const comments = await getUsersWithComment(0, client);
    const dateAsString: string = comments.registration_date;
    expect(typeof dateAsString).toBe("string");
})

test('select query with date type override (SQL)', async () => {
    const notifications = await getNotifications.run({userId: 1}, client);
    const dateAsString: string = notifications[0].created_at;
    expect(typeof dateAsString).toBe("string");
})

test('insert query with parameter spread', async () => {
  const [{ book_id: insertedBookId }] = await insertBooks.run(
      {
        books: [
          {
            authorId: 1,
            name: 'A Brief History of Time: From the Big Bang to Black Holes',
            rank: 1,
            categories: ['novel', 'science-fiction'],
          },
        ],
      },
      client,
  );
  const { 0: insertedBook } = await findBookById.run(
      { id: insertedBookId },
      client,
  );
  expect(insertedBook.categories).toEqual("{novel,science-fiction}");
})

test('update query with a non-null parameter override', async () => {
    await updateBooks.run({ id: 2, rank: 12, name: 'Another title' }, client);
})

test('insert query with an inline sql comment', async () => {
    const [result] = await insertComment.run({ comments: [{ commentBody: "Just a comment", userId: 1}] }, client);
    expect(result).toMatchSnapshot({
        id: expect.any(Number),
    });
})

test('dynamic update query', async () => {
    await updateBooksCustom.run({ id: 2, rank: 13 }, client);
})

test('update query with a multiple non-null parameter overrides', async () => {
    await updateBooksRankNotNull.run({ id: 2, rank: 12, name: 'Another title' }, client);
})

test('select query with join and a parameter override', async () => {
    const books = await getBooksByAuthorName.run(
      {
        authorName: 'Carl Sagan',
      },
      client,
    );
    expect(books).toMatchSnapshot();
})

test('select query with aggregation', async () => {
    const [aggregateData] = await aggregateEmailsAndTest.run(
        { testAges: [35, 23, 19] },
        client,
    );
    expect(aggregateData.agetest).toBe(true);
  expect(aggregateData.emails).toEqual([
    'alex.doe@example.com',
    'jane.holmes@example.com',
    'andrewjackson@example.com',
  ]);
})

test('insert query with an enum field', async () => {
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
});

test('multiple insert queries with an enum field', async () => {
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
})

test('select query with json fields and casts', async () => {
    const notifications = await thresholdFrogs.run({ numFrogs: 80 }, client);
    expect(notifications).toMatchSnapshot();
})

test('select query nullability override on return field', async () => {
    const result = await getBooks.run(undefined, client);
    expect(result).toMatchSnapshot();
})
