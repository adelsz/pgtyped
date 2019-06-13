import debugBase from 'debug';

const debug = debugBase('pg-typed');

const sql : any = null;

const query = sql`
  select id, name, age from users;
`;

async function main() {
  debug('starting codegenerator')
  if (true) console.log('aa')
}

main().catch((e) => debug('error in main: %o', e.message));