import debugBase from 'debug';
import {
  AsyncQueue,
} from '@pg-typed/wire';
import {
  startup,
  getTypes,
} from './actions';

const debug = debugBase('client');

async function main() {
  const q = new AsyncQueue();
  await startup({
    user: 'adel',
    database: 'testdb'
  },q);
  const query = `
    delete from users *
    where name = :userName and id = :userId and note = :userNote returning id, id, name, note as bote;
  `;
  const typeInfo = await getTypes(query, q);
  console.log(typeInfo);
}

main().catch((e) => debug('error in main: %o', e.message));