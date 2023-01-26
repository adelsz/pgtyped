import { queryASTToIR, parseSQLFile as parseSQLQuery } from '@pgtyped/parser';
import { processSQLQueryIR } from './preprocessor-sql.js';
import { ParameterTransform } from './preprocessor.js';

test('(SQL) no params', () => {
  const query = `
  /* @name selectSomeUsers */
  SELECT id, name FROM users;`;

  const fileAST = parseSQLQuery(query);
  const parameters = {};

  const expectedResult = {
    query: 'SELECT id, name FROM users',
    mapping: [],
    bindings: [],
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedResult);
  expect(mappingResult).toEqual(expectedResult);
});

test('(SQL) two scalar params, one forced as non-null', () => {
  const query = `
  /*
    @name UpdateBooksRankNotNull
  */
  UPDATE books
  SET
      rank = :rank!,
      name = :name
  WHERE id = :id!;`;

  const fileAST = parseSQLQuery(query);
  const parameters = {
    rank: 123,
    name: 'name',
    id: 'id',
  };

  const expectedInterpolationResult = {
    query:
      'UPDATE books\n  SET\n      rank = $1,\n      name = $2\n  WHERE id = $3',
    mapping: [],
    bindings: [123, 'name', 'id'],
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
});

test('(SQL) two scalar params', () => {
  const query = `
  /* @name selectSomeUsers */
  SELECT id, name from users where id = :id and age > :age;`;

  const fileAST = parseSQLQuery(query);
  const parameters = {
    id: '123',
    age: 12,
  };

  const expectedInterpolationResult = {
    query: 'SELECT id, name from users where id = $1 and age > $2',
    mapping: [],
    bindings: ['123', 12],
  };

  const expectedMappingResult = {
    query: 'SELECT id, name from users where id = $1 and age > $2',
    mapping: [
      {
        assignedIndex: 1,
        name: 'id',
        required: false,
        type: ParameterTransform.Scalar,
      },
      {
        assignedIndex: 2,
        name: 'age',
        required: false,
        type: ParameterTransform.Scalar,
      },
    ],
    bindings: [],
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) one param used twice', () => {
  const query = `
  /* @name selectUsersAndParents */
  SELECT id, name from users where id = :id or parent_id = :id;`;

  const fileAST = parseSQLQuery(query);
  const parameters = {
    id: '123',
  };

  const expectedInterpolationResult = {
    query: 'SELECT id, name from users where id = $1 or parent_id = $1',
    mapping: [],
    bindings: ['123'],
  };

  const expectedMappingResult = {
    query: 'SELECT id, name from users where id = $1 or parent_id = $1',
    mapping: [
      {
        assignedIndex: 1,
        name: 'id',
        required: false,
        type: ParameterTransform.Scalar,
      },
    ],
    bindings: [],
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) array param', () => {
  const query = `
  /*
    @name selectSomeUsers
    @param ages -> (...)
  */
  SELECT FROM users WHERE age in :ages;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    ages: [23, 27, 50],
  };

  const expectedInterpolationResult = {
    query: 'SELECT FROM users WHERE age in ($1,$2,$3)',
    bindings: [23, 27, 50],
    mapping: [],
  };

  const expectedMappingResult = {
    query: 'SELECT FROM users WHERE age in ($1)',
    bindings: [],
    mapping: [
      {
        name: 'ages',
        type: ParameterTransform.Spread,
        required: false,
        assignedIndex: 1,
      },
    ],
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) array param used twice', () => {
  const query = `
  /*
    @name selectSomeUsers
    @param ages -> (...)
  */
  SELECT FROM users WHERE age in :ages or age in :ages;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    ages: [23, 27, 50],
  };

  const expectedInterpolationResult = {
    query: 'SELECT FROM users WHERE age in ($1,$2,$3) or age in ($1,$2,$3)',
    bindings: [23, 27, 50],
    mapping: [],
  };

  const expectedMappingResult = {
    query: 'SELECT FROM users WHERE age in ($1) or age in ($1)',
    bindings: [],
    mapping: [
      {
        name: 'ages',
        required: false,
        type: ParameterTransform.Spread,
        assignedIndex: 1,
      },
    ],
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) array and scalar param', () => {
  const query = `
  /*
    @name selectSomeUsers
    @param ages -> (...)
  */
  SELECT FROM users WHERE age in :ages and id = :userId;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    ages: [23, 27, 50],
    userId: 'some-id',
  };

  const expectedInterpolationResult = {
    query: 'SELECT FROM users WHERE age in ($1,$2,$3) and id = $4',
    bindings: [23, 27, 50, 'some-id'],
    mapping: [],
  };

  const expectedMappingResult = {
    query: 'SELECT FROM users WHERE age in ($1) and id = $2',
    bindings: [],
    mapping: [
      {
        name: 'ages',
        type: ParameterTransform.Spread,
        required: false,
        assignedIndex: 1,
      },
      {
        name: 'userId',
        type: ParameterTransform.Scalar,
        required: false,
        assignedIndex: 2,
      },
    ],
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) pick param', () => {
  const query = `
  /*
    @name insertUsers
    @param user -> (name, age)
  */
  INSERT INTO users (name, age) VALUES :user RETURNING id;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    user: { name: 'Bob', age: 12 },
  };

  const expectedInterpolationResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id',
    bindings: ['Bob', 12],
    mapping: [],
  };

  const expectedMappingResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id',
    bindings: [],
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
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  expect(interpolationResult).toEqual(expectedInterpolationResult);

  const mappingResult = processSQLQueryIR(queryIR);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) pick param used twice', () => {
  const query = `
  /*
    @name insertUsersTwice
    @param user -> (name, age)
  */
  INSERT INTO users (name, age) VALUES :user, :user RETURNING id;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    user: { name: 'Bob', age: 12 },
  };

  const expectedInterpolationResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2), ($1,$2) RETURNING id',
    bindings: ['Bob', 12],
    mapping: [],
  };

  const expectedMappingResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2), ($1,$2) RETURNING id',
    bindings: [],
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
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  expect(interpolationResult).toEqual(expectedInterpolationResult);

  const mappingResult = processSQLQueryIR(queryIR);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) pickSpread param', () => {
  const query = `
  /*
    @name insertUsers
    @param users -> ((name, age)...)
  */
  INSERT INTO users (name, age) VALUES :users RETURNING id;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    users: [
      { name: 'Bob', age: 12 },
      { name: 'Tom', age: 22 },
    ],
  };

  const expectedInterpolationResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2),($3,$4) RETURNING id',
    bindings: ['Bob', 12, 'Tom', 22],
    mapping: [],
  };

  const expectedMapping = [
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
  ];

  const expectedMappingResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id',
    bindings: [],
    mapping: expectedMapping,
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) pickSpread param used twice', () => {
  const query = `
  /*
    @name insertUsers
    @param users -> ((name, age)...)
  */
  INSERT INTO users (name, age) VALUES :users, :users RETURNING id;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    users: [
      { name: 'Bob', age: 12 },
      { name: 'Tom', age: 22 },
    ],
  };

  const expectedInterpolationResult = {
    query:
      'INSERT INTO users (name, age) VALUES ($1,$2),($3,$4), ($1,$2),($3,$4) RETURNING id',
    bindings: ['Bob', 12, 'Tom', 22],
    mapping: [],
  };

  const expectedMapping = [
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
  ];

  const expectedMappingResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2), ($1,$2) RETURNING id',
    bindings: [],
    mapping: expectedMapping,
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) scalar param required and optional', () => {
  const query = `
  /* @name selectSomeUsers */
  SELECT id, name from users where id = :id! and user_id = :id;`;

  const fileAST = parseSQLQuery(query);
  const parameters = {
    id: '123',
  };

  const expectedInterpolationResult = {
    query: 'SELECT id, name from users where id = $1 and user_id = $1',
    mapping: [],
    bindings: ['123'],
  };

  const expectedMappingResult = {
    query: 'SELECT id, name from users where id = $1 and user_id = $1',
    mapping: [
      {
        assignedIndex: 1,
        name: 'id',
        required: true,
        type: ParameterTransform.Scalar,
      },
    ],
    bindings: [],
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) pick param required', () => {
  const query = `
  /*
    @name insertUsers
    @param user -> (name!, age)
  */
  INSERT INTO users (name, age) VALUES :user RETURNING id;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    user: { name: 'Bob', age: 12 },
  };

  const expectedInterpolationResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id',
    bindings: ['Bob', 12],
    mapping: [],
  };

  const expectedMappingResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id',
    bindings: [],
    mapping: [
      {
        name: 'user',
        type: ParameterTransform.Pick,
        dict: {
          name: {
            assignedIndex: 1,
            name: 'name',
            type: ParameterTransform.Scalar,
            required: true,
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
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  expect(interpolationResult).toEqual(expectedInterpolationResult);

  const mappingResult = processSQLQueryIR(queryIR);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) array param required', () => {
  const query = `
  /*
    @name selectSomeUsers
    @param ages -> (...)
  */
  SELECT FROM users WHERE age in :ages!;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    ages: [23, 27, 50],
  };

  const expectedInterpolationResult = {
    query: 'SELECT FROM users WHERE age in ($1,$2,$3)',
    bindings: [23, 27, 50],
    mapping: [],
  };

  const expectedMappingResult = {
    query: 'SELECT FROM users WHERE age in ($1)',
    bindings: [],
    mapping: [
      {
        name: 'ages',
        type: ParameterTransform.Spread,
        required: true,
        assignedIndex: 1,
      },
    ],
  };

  const queryIR = queryASTToIR(fileAST.queries[0]);
  const interpolationResult = processSQLQueryIR(queryIR, parameters);
  const mappingResult = processSQLQueryIR(queryIR);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});
