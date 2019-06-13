import { desugarQuery } from './actions';

test('basic query desugaring works', () => {
  const query = 'select * from users where id = :userId and name = :userName';
  const {
    desugaredQuery,
    paramNames,
  } = desugarQuery(query);
  expect(desugaredQuery).toEqual('select * from users where id = $1 and name = $2');
  expect(paramNames).toEqual(['userId', 'userName']);
})