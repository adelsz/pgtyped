import { Client, QueryResult } from 'pg';
import { selectAllUsers } from './users/queries';

const client = new Client({
  user: 'adel',
  password: '',
  database: 'testdb',
});

async function main() {
  await client.connect();
  const users = await selectAllUsers.run(
    {
      ages: [34, 45],
    },
    client,
  );

  if (users.length > 0) {
    // tslint:disable:no-console
    console.log(users[0].name);
  }
}

main();
