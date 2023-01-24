import { parseTSQuery } from '@pgtyped/parser';
import { ParameterTransform } from './preprocessor.js';
import { processTSQueryAST } from './preprocessor-ts.js';

test('(TS) name parameter interpolation', () => {
  const query = 'SELECT id, name from users where id = $id and age > $age';
  const parsedQuery = parseTSQuery(query);
  const parameters = {
    id: '123',
    age: 12,
  };

  const expectedResult = {
    query: 'SELECT id, name from users where id = $1 and age > $2',
    mapping: [],
    bindings: ['123', 12],
  };

  const result = processTSQueryAST(parsedQuery.query, parameters);

  expect(result).toEqual(expectedResult);
});

test('(TS) pick parameter interpolation (multiline)', () => {
  const query = `
    INSERT INTO notifications (payload, user_id, type)
    VALUES $notification(payload, user_id, type)
  `;
  const parsedQuery = parseTSQuery(query);
  const parameters = {
    notification: {
      user_id: 1,
      payload: { num_frogs: 1002 },
      type: 'reminder',
    },
  };

  const expectedResult = {
    query: `
    INSERT INTO notifications (payload, user_id, type)
    VALUES ($1, $2, $3)`,
    mapping: [],
    bindings: [{ num_frogs: 1002 }, 1, 'reminder'],
  };

  const result = processTSQueryAST(parsedQuery.query, parameters as any);

  expect(result).toEqual(expectedResult);
});

test('(TS) pick array parameter interpolation (multiline)', () => {
  const query = `
    INSERT INTO notifications (payload, user_id, type)
    VALUES $$params(payload, user_id, type)
  `;
  const parsedQuery = parseTSQuery(query);
  const parameters = {
    params: [
      {
        user_id: 1,
        payload: { num_frogs: 1002 },
        type: 'reminder',
      },
    ],
  };

  const expectedResult = {
    query: `
    INSERT INTO notifications (payload, user_id, type)
    VALUES ($1, $2, $3)`,
    mapping: [],
    bindings: [{ num_frogs: 1002 }, 1, 'reminder'],
  };

  const result = processTSQueryAST(parsedQuery.query, parameters as any);

  expect(result).toEqual(expectedResult);
});

test('(TS) scalar param used twice', () => {
  const query = 'SELECT id, name from users where id = $id and parent_id = $id';
  const parsedQuery = parseTSQuery(query);
  const parameters = {
    id: '123',
  };

  const expectedResult = {
    query: 'SELECT id, name from users where id = $1 and parent_id = $1',
    mapping: [],
    bindings: ['123'],
  };

  const result = processTSQueryAST(parsedQuery.query, parameters);

  expect(result).toEqual(expectedResult);
});

test('(TS) name parameter mapping', () => {
  const query =
    'SELECT id, name from users where id = $id and age > $age and parent_id = $id';
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query:
      'SELECT id, name from users where id = $1 and age > $2 and parent_id = $1',
    mapping: [],
    bindings: ['1234-1235', 33],
  };

  const result = processTSQueryAST(parsedQuery.query, {
    id: '1234-1235',
    age: 33,
  });

  expect(result).toEqual(expectedResult);
});

test('(TS) single value list parameter interpolation', () => {
  const query =
    'INSERT INTO users (name, age) VALUES $user(name, age) RETURNING id';
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id',
    mapping: [
      {
        name: 'user',
        type: ParameterTransform.Pick,
        dict: {
          name: {
            assignedIndex: 1,
            name: 'name',
            type: ParameterTransform.Scalar,
            required: false,
          },
          age: {
            assignedIndex: 2,
            name: 'age',
            type: ParameterTransform.Scalar,
            required: false,
          },
        },
      },
    ],
    bindings: [],
  };

  const result = processTSQueryAST(parsedQuery.query);

  expect(result).toEqual(expectedResult);
});

test('(TS) single value list parameter interpolation twice', () => {
  const query =
    'INSERT INTO users (name, age) VALUES $user(name, age) BOGUS $user(name, id) RETURNING id';
  const parsedQuery = parseTSQuery(query);

  const parameters = {
    user: {
      id: '1234-123-1233',
      name: 'Bob',
      age: 12,
    },
  };

  const expectedResult = {
    query:
      'INSERT INTO users (name, age) VALUES ($1, $2) BOGUS ($1, $3) RETURNING id',
    mapping: [],
    bindings: ['Bob', 12, '1234-123-1233'],
  };

  const result = processTSQueryAST(parsedQuery.query, parameters);

  expect(result).toEqual(expectedResult);
});

test('(TS) multiple value list (array) parameter mapping', () => {
  const query =
    'SELECT FROM users where (age in $$ages and age in $$ages) or (age in $$otherAges)';
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query:
      'SELECT FROM users where (age in ($1) and age in ($1)) or (age in ($2))',
    mapping: [
      {
        name: 'ages',
        type: ParameterTransform.Spread,
        required: false,
        assignedIndex: [1],
      },
      {
        name: 'otherAges',
        type: ParameterTransform.Spread,
        required: false,
        assignedIndex: [2],
      },
    ],
    bindings: [],
  };

  const result = processTSQueryAST(parsedQuery.query);

  expect(result).toEqual(expectedResult);
});

test('(TS) multiple value list (array) parameter interpolation', () => {
  const query = 'SELECT FROM users where age in $$ages or parent_age in $$ages';
  const parsedQuery = parseTSQuery(query);

  const parameters = {
    ages: [23, 27, 50],
  };

  const expectedResult = {
    query:
      'SELECT FROM users where age in ($1, $2, $3) or parent_age in ($1, $2, $3)',
    bindings: [23, 27, 50],
    mapping: [],
  };

  const result = processTSQueryAST(parsedQuery.query, parameters);

  expect(result).toEqual(expectedResult);
});

test('(TS) multiple value list parameter mapping', () => {
  const query =
    'INSERT INTO users (name, age) VALUES $$users(name, age) RETURNING id';
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id',
    bindings: [],
    mapping: [
      {
        name: 'users',
        type: ParameterTransform.PickSpread,
        dict: {
          name: {
            name: 'name',
            type: ParameterTransform.Scalar,
            required: false,
            assignedIndex: 1,
          },
          age: {
            name: 'age',
            type: ParameterTransform.Scalar,
            required: false,
            assignedIndex: 2,
          },
        },
      },
    ],
  };

  const result = processTSQueryAST(parsedQuery.query);

  expect(result).toEqual(expectedResult);
});

test('(TS) multiple value list parameter mapping twice', () => {
  const query =
    'INSERT INTO users (name, age) VALUES $$users(name, age), $$users(name) RETURNING id';
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1, $2), ($1) RETURNING id',
    bindings: [],
    mapping: [
      {
        name: 'users',
        type: ParameterTransform.PickSpread,
        dict: {
          name: {
            name: 'name',
            type: ParameterTransform.Scalar,
            required: false,
            assignedIndex: 1,
          },
          age: {
            name: 'age',
            type: ParameterTransform.Scalar,
            required: false,
            assignedIndex: 2,
          },
        },
      },
    ],
  };

  const result = processTSQueryAST(parsedQuery.query);

  expect(result).toEqual(expectedResult);
});

test('(TS) multiple value list parameter interpolation', () => {
  const query =
    'INSERT INTO users (name, age) VALUES $$users(name, age) RETURNING id';
  const parsedQuery = parseTSQuery(query);

  const parameters = {
    users: [
      { name: 'Bob', age: 12 },
      { name: 'Tom', age: 22 },
    ],
  };

  const expectedResult = {
    query:
      'INSERT INTO users (name, age) VALUES ($1, $2), ($3, $4) RETURNING id',
    bindings: ['Bob', 12, 'Tom', 22],
    mapping: [],
  };

  const result = processTSQueryAST(parsedQuery.query, parameters);

  expect(result).toEqual(expectedResult);
});

test('(TS) multiple value list parameter interpolation twice', () => {
  const query =
    'INSERT INTO users (name, age) VALUES $$users(name, age), $$users(name, age) RETURNING id';
  const parsedQuery = parseTSQuery(query);

  const parameters = {
    users: [
      { name: 'Bob', age: 12 },
      { name: 'Tom', age: 22 },
    ],
  };

  const expectedResult = {
    query:
      'INSERT INTO users (name, age) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8) RETURNING id',
    bindings: ['Bob', 12, 'Tom', 22, 'Bob', 12, 'Tom', 22],
    mapping: [],
  };

  const result = processTSQueryAST(parsedQuery.query, parameters);

  expect(result).toEqual(expectedResult);
});

test('(TS) query with no params', () => {
  const query = `UPDATE notifications SET payload = '{"a": "b"}'::jsonb`;
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query: `UPDATE notifications SET payload = '{"a": "b"}'::jsonb`,
    bindings: [],
    mapping: [],
  };

  const result = processTSQueryAST(parsedQuery.query);

  expect(result).toEqual(expectedResult);
});

test('(TS) query with empty spread params', () => {
  const query = `SELECT * FROM users WHERE id IN $$ids`;
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query: `SELECT * FROM users WHERE id IN ()`,
    bindings: [],
    mapping: [],
  };

  const result = processTSQueryAST(parsedQuery.query, { ids: [] });

  expect(result).toEqual(expectedResult);
});

test('(TS) query with empty spread params', () => {
  const query = `INSERT INTO data.action_log (id, name) VALUES $$params(id, name)`;
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query: `INSERT INTO data.action_log (id, name) VALUES ()`,
    bindings: [],
    mapping: [],
  };

  const result = processTSQueryAST(parsedQuery.query, { params: [] });

  expect(result).toEqual(expectedResult);
});

test('(TS) query with underscores in key names and param names', () => {
  const query = `INSERT INTO data.action_log (_id, _name) VALUES $$_params(_id, _name)`;
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query: `INSERT INTO data.action_log (_id, _name) VALUES ($1, $2)`,
    bindings: ['one', 'two'],
    mapping: [],
  };

  const result = processTSQueryAST(parsedQuery.query, {
    _params: [{ _id: 'one', _name: 'two' }],
  });

  expect(result).toEqual(expectedResult);
});

test('(TS) all kinds mapping ', () => {
  const query =
    'SELECT $userId $age! $userId $$users $age $user(id) $$users $user(id, parentId, age) $$comments(id!, text) $user(age!)';
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query: 'SELECT $1 $2 $1 ($3) $2 ($4) ($3) ($4, $5, $6) ($7, $8) ($6)',
    bindings: [],
    mapping: [
      {
        name: 'userId',
        type: ParameterTransform.Scalar,
        required: false,
        assignedIndex: 1,
      },
      {
        name: 'age',
        type: ParameterTransform.Scalar,
        required: true,
        assignedIndex: 2,
      },
      {
        name: 'users',
        type: ParameterTransform.Spread,
        required: false,
        assignedIndex: [3],
      },
      {
        name: 'user',
        type: ParameterTransform.Pick,
        dict: {
          id: {
            name: 'id',
            type: ParameterTransform.Scalar,
            required: false,
            assignedIndex: 4,
          },
          age: {
            name: 'age',
            type: ParameterTransform.Scalar,
            required: true,
            assignedIndex: 6,
          },
          parentId: {
            name: 'parentId',
            type: ParameterTransform.Scalar,
            required: false,
            assignedIndex: 5,
          },
        },
      },
      {
        name: 'comments',
        type: ParameterTransform.PickSpread,
        dict: {
          id: {
            name: 'id',
            type: ParameterTransform.Scalar,
            required: true,
            assignedIndex: 7,
          },
          text: {
            name: 'text',
            type: ParameterTransform.Scalar,
            required: false,
            assignedIndex: 8,
          },
        },
      },
    ],
  };

  const result = processTSQueryAST(parsedQuery.query);

  expect(result).toEqual(expectedResult);
});

test('(TS) required spread', () => {
  const query = 'SELECT $$users!';
  const parsedQuery = parseTSQuery(query);

  const expectedResult = {
    query: 'SELECT ($1)',
    bindings: [],
    mapping: [
      {
        name: 'users',
        type: ParameterTransform.Spread,
        required: true,
        assignedIndex: [1],
      },
    ],
  };

  const result = processTSQueryAST(parsedQuery.query);
  expect(result).toEqual(expectedResult);
});
