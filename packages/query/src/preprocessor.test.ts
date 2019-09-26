import interpolate from './preprocessor';

test('name parameter interpolation', () => {
  const query = 'SELECT id, name from users where id = :id and age > :age';
  const parameters = {
    id: '123',
    age: 12,
  };

  const expectedResult = {
    query: 'SELECT id, name from users where id = $1 and age > $2',
    mapping: [],
    bindings: ['123', 12],
  };

  const result = interpolate(query, parameters);

  expect(result).toEqual(expectedResult);
});

test('name parameter mapping', () => {
  const query = 'SELECT id, name from users where id = :id and age > :age';

  const expectedResult = {
    query: 'SELECT id, name from users where id = $1 and age > $2',
    mapping: [
      {
        assignedIndex: 1,
        name: 'id',
        type: 'scalar',
      },
      {
        assignedIndex: 2,
        name: 'age',
        type: 'scalar',
      },
    ],
    bindings: [],
  };

  const result = interpolate(query);

  expect(result).toEqual(expectedResult);
});

test('single value list parameter interpolation', () => {
  const query = 'INSERT INTO users (name, age) VALUES :user(:name, :age) RETURNING id';

  const parameters = {
    user: {
      name: 'Bob',
      age: 12,
    },
  };

  const expectedResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id',
    mapping: [
      {
        name: 'user',
        type: 'dict',
        dict: {
          name: {
            assignedIndex: 1,
            name: 'name',
            type: 'scalar',
          },
          age: {
            assignedIndex: 2,
            name: 'age',
            type: 'scalar',
          }
        },
      },
    ],
    bindings: [],
  };

  const result = interpolate(query, parameters);

  expect(result).toEqual(expectedResult);
})

test('multiple value list (array) parameter mapping', () => {
  const query = 'SELECT FROM users where (age in ::ages) or (age in ::otherAges)';

  const expectedResult = {
    query: 'SELECT FROM users where (age in ($1)) or (age in ($2))',
    mapping: [
      {
        name: 'ages',
        type: 'scalar[]',
        assignedIndex: 1,
      },
      {
        name: 'otherAges',
        type: 'scalar[]',
        assignedIndex: 2,
      },
    ],
    bindings: [],
  };

  const result = interpolate(query);

  expect(result).toEqual(expectedResult);
})

test('multiple value list (array) parameter interpolation', () => {
  const query = 'SELECT FROM users where age in ::ages';

  const parameters = {
    ages: [23, 27, 50],
  };

  const expectedResult = {
    query: 'SELECT FROM users where age in ($1, $2, $3)',
    bindings: [23, 27, 50],
    mapping: [],
  };

  const result = interpolate(query, parameters);

  expect(result).toEqual(expectedResult);
})

test('multiple value list parameter mapping', () => {
  const query = 'INSERT INTO users (name, age) VALUES ::users(:name, :age) RETURNING id';

  const expectedResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id',
    bindings: [],
    mapping: [
      {
        name: 'users',
        type: 'dict[]',
        dict: {
          name: 1,
          age: 2,
        }
      },
    ],
  };

  const result = interpolate(query);

  expect(result).toEqual(expectedResult);
})

test('multiple value list parameter interpolation', () => {
  const query = 'INSERT INTO users (name, age) VALUES ::users(:name, :age) RETURNING id';

  const parameters = {
    users: [
      { name: 'Bob', age: 12 },
      { name: 'Tom', age: 22 },
    ],
  };

  const expectedResult = {
    query: 'INSERT INTO users (name, age) VALUES ($1, $2), ($3, $4) RETURNING id',
    bindings: ['Bob', 12, 'Tom', 22],
    mapping: [],
  };

  const result = interpolate(query, parameters);

  expect(result).toEqual(expectedResult);
})
