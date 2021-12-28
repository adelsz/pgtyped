import parseSQLQuery from './loader/sql';
import { processSQLQueryAST } from './preprocessor-sql';
import { ParamTransform } from './preprocessor';

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
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

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
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );

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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'SELECT id, name from users where id = $1 and age > $2',
    mapping: [
      {
        assignedIndex: 1,
        name: 'id',
        required: false,
        type: ParamTransform.Scalar,
      },
      {
        assignedIndex: 2,
        name: 'age',
        required: false,
        type: ParamTransform.Scalar,
      },
    ],
    bindings: [],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'SELECT id, name from users where id = $1 or parent_id = $1',
    mapping: [
      {
        assignedIndex: 1,
        name: 'id',
        required: false,
        type: ParamTransform.Scalar,
      },
    ],
    bindings: [],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'SELECT FROM users WHERE age in ($1)',
    bindings: [],
    mapping: [
      {
        name: 'ages',
        type: ParamTransform.Spread,
        required: false,
        assignedIndex: 1,
      },
    ],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'SELECT FROM users WHERE age in ($1) or age in ($1)',
    bindings: [],
    mapping: [
      {
        name: 'ages',
        required: false,
        type: ParamTransform.Spread,
        assignedIndex: 1,
      },
    ],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'SELECT FROM users WHERE age in ($1) and id = $2',
    bindings: [],
    mapping: [
      {
        name: 'ages',
        type: ParamTransform.Spread,
        required: false,
        assignedIndex: 1,
      },
      {
        name: 'userId',
        type: ParamTransform.Scalar,
        required: false,
        assignedIndex: 2,
      },
    ],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id',
    bindings: [],
    mapping: [
      {
        name: 'user',
        type: ParamTransform.Pick,
        dict: {
          name: {
            assignedIndex: 1,
            name: 'name',
            type: ParamTransform.Scalar,
            required: false,
          },
          age: {
            assignedIndex: 2,
            name: 'age',
            type: ParamTransform.Scalar,
            required: false,
          },
        },
      },
    ],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  expect(interpolationResult).toEqual(expectedInterpolationResult);

  const mappingResult = processSQLQueryAST(fileAST.queries[0]);
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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2), ($1,$2) RETURNING id',
    bindings: [],
    mapping: [
      {
        name: 'user',
        type: ParamTransform.Pick,
        dict: {
          name: {
            assignedIndex: 1,
            name: 'name',
            type: ParamTransform.Scalar,
            required: false,
          },
          age: {
            assignedIndex: 2,
            name: 'age',
            type: ParamTransform.Scalar,
            required: false,
          },
        },
      },
    ],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  expect(interpolationResult).toEqual(expectedInterpolationResult);

  const mappingResult = processSQLQueryAST(fileAST.queries[0]);
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
    hintedColumnAliases: {},
  };

  const expectedMapping = [
    {
      name: 'users',
      type: ParamTransform.PickSpread,
      dict: {
        name: {
          name: 'name',
          type: ParamTransform.Scalar,
          required: false,
          assignedIndex: 1,
        },
        age: {
          name: 'age',
          type: ParamTransform.Scalar,
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
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

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
    hintedColumnAliases: {},
  };

  const expectedMapping = [
    {
      name: 'users',
      type: ParamTransform.PickSpread,
      dict: {
        name: {
          name: 'name',
          type: ParamTransform.Scalar,
          required: false,
          assignedIndex: 1,
        },
        age: {
          name: 'age',
          type: ParamTransform.Scalar,
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
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'SELECT id, name from users where id = $1 and user_id = $1',
    mapping: [
      {
        assignedIndex: 1,
        name: 'id',
        required: true,
        type: ParamTransform.Scalar,
      },
    ],
    bindings: [],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id',
    bindings: [],
    mapping: [
      {
        name: 'user',
        type: ParamTransform.Pick,
        dict: {
          name: {
            assignedIndex: 1,
            name: 'name',
            type: ParamTransform.Scalar,
            required: true,
          },
          age: {
            assignedIndex: 2,
            name: 'age',
            type: ParamTransform.Scalar,
            required: false,
          },
        },
      },
    ],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  expect(interpolationResult).toEqual(expectedInterpolationResult);

  const mappingResult = processSQLQueryAST(fileAST.queries[0]);
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
    hintedColumnAliases: {},
  };

  const expectedMappingResult = {
    query: 'SELECT FROM users WHERE age in ($1)',
    bindings: [],
    mapping: [
      {
        name: 'ages',
        type: ParamTransform.Spread,
        required: true,
        assignedIndex: 1,
      },
    ],
    hintedColumnAliases: {},
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test('(SQL) select non-nullability hint', () => {
  const query = `
  /* @name countFromTable */
  SELECT count(*) AS "count!" FROM table;`;
  const fileAST = parseSQLQuery(query);
  const parameters = {};

  const expectedInterpolationResult = {
    query: 'SELECT count(*) AS "count" FROM table',
    bindings: [],
    mapping: [],
    hintedColumnAliases: {
      count: {
        nullable: false,
        aliasHintLocation: {
          a: 52,
          b: 57,
        },
      },
    },
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );

  expect(interpolationResult).toEqual(expectedInterpolationResult);
});

test('(SQL) select non-nullability hint complexer query', () => {
  const query = `
  /* @name selectUsersAndEmails */
  SELECT u.id, (SELECT id from user_emails where user_id = u.id) as "email!" from users u`;
  const fileAST = parseSQLQuery(query);
  const parameters = {};

  const expectedInterpolationResult = {
    query:
      'SELECT u.id, (SELECT id from user_emails where user_id = u.id) as "email" from users u',
    bindings: [],
    mapping: [],
    hintedColumnAliases: {
      email: {
        nullable: false,
        aliasHintLocation: {
          a: 105,
          b: 110,
        },
      },
    },
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );

  expect(interpolationResult).toEqual(expectedInterpolationResult);
});

test('(SQL) select nullability hint', () => {
  const query = `
  /* @name selectUsersAndNames */
  SELECT id, name AS "name?" FROM users LEFT JOIN names USING (id);`;
  const fileAST = parseSQLQuery(query);
  const parameters = {};

  const expectedInterpolationResult = {
    query: 'SELECT id, name AS "name" FROM users LEFT JOIN names USING (id)',
    bindings: [],
    mapping: [],
    hintedColumnAliases: {
      name: {
        nullable: true,
        aliasHintLocation: {
          a: 57,
          b: 61,
        },
      },
    },
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );

  expect(interpolationResult).toEqual(expectedInterpolationResult);
});

test('(SQL) select non-nullability hint with parameter', () => {
  const query = `
  /* @name getUserTotalScores */
  SELECT coalesce(sum(score), 0) AS "total_score!" FROM users WHERE id = :id!;`;
  const fileAST = parseSQLQuery(query);
  const parameters = { id: 'id' };

  const expectedInterpolationResult = {
    query:
      'SELECT coalesce(sum(score), 0) AS "total_score" FROM users WHERE id = $1',
    bindings: ['id'],
    mapping: [],
    hintedColumnAliases: {
      total_score: {
        nullable: false,
        aliasHintLocation: {
          a: 71,
          b: 82,
        },
      },
    },
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );

  expect(interpolationResult).toEqual(expectedInterpolationResult);
});

test('(SQL) pickSpread param with non-null counting rows', () => {
  const query = `
  /*
    @name insertUsers
    @param users -> ((name, age)...)
  */
  WITH rows AS (INSERT INTO users (name, age) VALUES :users RETURNING 1) SELECT count(*) AS "count!" FROM rows;`;
  const fileAST = parseSQLQuery(query);

  const parameters = {
    users: [
      { name: 'Bob', age: 12 },
      { name: 'Tom', age: 22 },
    ],
  };

  const expectedInterpolationResult = {
    query:
      'WITH rows AS (INSERT INTO users (name, age) VALUES ($1,$2),($3,$4) RETURNING 1) SELECT' +
      ' count(*) AS "count" FROM rows',
    bindings: ['Bob', 12, 'Tom', 22],
    mapping: [],
    hintedColumnAliases: {
      count: {
        aliasHintLocation: {
          a: 163,
          b: 168,
        },
        nullable: false,
      },
    },
  };

  const expectedMapping = [
    {
      name: 'users',
      type: ParamTransform.PickSpread,
      dict: {
        name: {
          name: 'name',
          type: ParamTransform.Scalar,
          required: false,
          assignedIndex: 1,
        },
        age: {
          name: 'age',
          type: ParamTransform.Scalar,
          required: false,
          assignedIndex: 2,
        },
      },
    },
  ];

  const expectedMappingResult = {
    query:
      'WITH rows AS (INSERT INTO users (name, age) VALUES ($1,$2) RETURNING 1) SELECT count(*) AS' +
      ' "count" FROM rows',
    bindings: [],
    mapping: expectedMapping,
    hintedColumnAliases: {
      count: {
        aliasHintLocation: {
          a: 163,
          b: 168,
        },
        nullable: false,
      },
    },
  };

  const interpolationResult = processSQLQueryAST(
    fileAST.queries[0],
    parameters,
  );
  const mappingResult = processSQLQueryAST(fileAST.queries[0]);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});
