import { Client, QueryResult } from "pg";
import { selectAllUsers } from "./users/queries";

const client = new Client({
  user: "adel",
  password: "",
  database: "testdb",
});

async function main() {
  await client.connect();
  const users = await selectAllUsers.run({
    ages: [34, 45],
  }, client);

  // tslint:disable:no-console
  console.log(users);
}

main();
