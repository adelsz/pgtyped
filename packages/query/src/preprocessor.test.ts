import {ParamTransform, processQueryAST, processQueryString} from "./preprocessor";
import parseText from "./loader/sql";

test("name parameter interpolation", () => {
  const query = "SELECT id, name from users where id = $id and age > $age";
  const parameters = {
    id: "123",
    age: 12,
  };

  const expectedResult = {
    query: "SELECT id, name from users where id = $1 and age > $2",
    mapping: [],
    bindings: ["123", 12],
  };

  const result = processQueryString(query, parameters);

  expect(result).toEqual(expectedResult);
});

test("name parameter mapping", () => {
  const query = "SELECT id, name from users where id = $id and age > $age";

  const expectedResult = {
    query: "SELECT id, name from users where id = $1 and age > $2",
    mapping: [
      {
        assignedIndex: 1,
        name: "id",
        type: ParamTransform.Scalar,
      },
      {
        assignedIndex: 2,
        name: "age",
        type: ParamTransform.Scalar,
      },
    ],
    bindings: [],
  };

  const result = processQueryString(query);

  expect(result).toEqual(expectedResult);
});

test("single value list parameter interpolation", () => {
  const query = "INSERT INTO users (name, age) VALUES $user(name, age) RETURNING id";

  const parameters = {
    user: {
      name: "Bob",
      age: 12,
    },
  };

  const expectedResult = {
    query: "INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id",
    mapping: [
      {
        name: "user",
        type: ParamTransform.Pick,
        dict: {
          name: {
            assignedIndex: 1,
            name: "name",
            type: ParamTransform.Scalar,
          },
          age: {
            assignedIndex: 2,
            name: "age",
            type: ParamTransform.Scalar,
          },
        },
      },
    ],
    bindings: [],
  };

  const result = processQueryString(query, parameters);

  expect(result).toEqual(expectedResult);
});

test("multiple value list (array) parameter mapping", () => {
  const query = "SELECT FROM users where (age in $$ages) or (age in $$otherAges)";

  const expectedResult = {
    query: "SELECT FROM users where (age in ($1)) or (age in ($2))",
    mapping: [
      {
        name: "ages",
        type: ParamTransform.Spread,
        assignedIndex: 1,
      },
      {
        name: "otherAges",
        type: ParamTransform.Spread,
        assignedIndex: 2,
      },
    ],
    bindings: [],
  };

  const result = processQueryString(query);

  expect(result).toEqual(expectedResult);
});

test("multiple value list (array) parameter interpolation", () => {
  const query = "SELECT FROM users where age in $$ages";

  const parameters = {
    ages: [23, 27, 50],
  };

  const expectedResult = {
    query: "SELECT FROM users where age in ($1, $2, $3)",
    bindings: [23, 27, 50],
    mapping: [],
  };

  const result = processQueryString(query, parameters);

  expect(result).toEqual(expectedResult);
});

test("multiple value list parameter mapping", () => {
  const query = "INSERT INTO users (name, age) VALUES $$users(name, age) RETURNING id";

  const expectedResult = {
    query: "INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id",
    bindings: [],
    mapping: [
      {
        name: "users",
        type: ParamTransform.PickSpread,
        dict: {
          name: {name: "name", type: ParamTransform.Scalar, assignedIndex: 1},
          age: {name: "age", type: ParamTransform.Scalar, assignedIndex: 2},
        },
      },
    ],
  };

  const result = processQueryString(query);

  expect(result).toEqual(expectedResult);
});

test("multiple value list parameter interpolation", () => {
  const query = "INSERT INTO users (name, age) VALUES $$users(name, age) RETURNING id";

  const parameters = {
    users: [
      {name: "Bob", age: 12},
      {name: "Tom", age: 22},
    ],
  };

  const expectedResult = {
    query: "INSERT INTO users (name, age) VALUES ($1, $2), ($3, $4) RETURNING id",
    bindings: ["Bob", 12, "Tom", 22],
    mapping: [],
  };

  const result = processQueryString(query, parameters);

  expect(result).toEqual(expectedResult);
});

test("(AST) no params", () => {
  const query = `
  /* @name selectSomeUsers */
  SELECT id, name FROM users;`;

  const fileAST = parseText(query);
  const parameters = {};

  const expectedResult = {
    query: "SELECT id, name FROM users",
    mapping: [],
    bindings: [],
  };

  const interpolationResult = processQueryAST(fileAST.parseTree.queries[0], parameters);
  const mappingResult = processQueryAST(fileAST.parseTree.queries[0]);

  expect(interpolationResult).toEqual(expectedResult);
  expect(mappingResult).toEqual(expectedResult);
});

test("(AST) two scalar params", () => {
  const query = `
  /* @name selectSomeUsers */
  SELECT id, name from users where id = :id and age > :age;`;

  const fileAST = parseText(query);
  const parameters = {
    id: "123",
    age: 12,
  };

  const expectedInterpolationResult = {
    query: "SELECT id, name from users where id = $1 and age > $2",
    mapping: [],
    bindings: ["123", 12],
  };

  const expectedMappingResult = {
    query: "SELECT id, name from users where id = $1 and age > $2",
    mapping: [
      {
        assignedIndex: 1,
        name: "id",
        type: ParamTransform.Scalar,
      },
      {
        assignedIndex: 2,
        name: "age",
        type: ParamTransform.Scalar,
      },
    ],
    bindings: [],
  };

  const interpolationResult = processQueryAST(fileAST.parseTree.queries[0], parameters);
  const mappingResult = processQueryAST(fileAST.parseTree.queries[0]);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});


test("(AST) array param", () => {
  const query = `
  /*
    @name selectSomeUsers
    @param ages -> (...)
  */
  SELECT FROM users WHERE age in :ages;`;
  const fileAST = parseText(query);

  const parameters = {
    ages: [23, 27, 50],
  };

  const expectedInterpolationResult = {
    query: "SELECT FROM users WHERE age in ($1,$2,$3)",
    bindings: [23, 27, 50],
    mapping: [],
  };

  const expectedMappingResult = {
    query: "SELECT FROM users WHERE age in ($1)",
    bindings: [],
    mapping: [
      {
        name: "ages",
        type: ParamTransform.Spread,
        assignedIndex: 1,
      },
    ],
  };

  const interpolationResult = processQueryAST(fileAST.parseTree.queries[0], parameters);
  const mappingResult = processQueryAST(fileAST.parseTree.queries[0]);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test("(AST) array and scalar param", () => {
  const query = `
  /*
    @name selectSomeUsers
    @param ages -> (...)
  */
  SELECT FROM users WHERE age in :ages and id = :userId;`;
  const fileAST = parseText(query);

  const parameters = {
    ages: [23, 27, 50],
    userId: "some-id"
  };

  const expectedInterpolationResult = {
    query: "SELECT FROM users WHERE age in ($1,$2,$3) and id = $4",
    bindings: [23, 27, 50, "some-id"],
    mapping: [],
  };

  const expectedMappingResult = {
    query: "SELECT FROM users WHERE age in ($1) and id = $2",
    bindings: [],
    mapping: [
      {
        name: "ages",
        type: ParamTransform.Spread,
        assignedIndex: 1,
      },
      {
        name: "userId",
        type: ParamTransform.Scalar,
        assignedIndex: 2,
      },
    ],
  };

  const interpolationResult = processQueryAST(fileAST.parseTree.queries[0], parameters);
  const mappingResult = processQueryAST(fileAST.parseTree.queries[0]);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});


test("(AST) pick param", () => {
  const query = `
  /*
    @name insertUsers
    @param user -> (name, age)
  */
  INSERT INTO users (name, age) VALUES :user RETURNING id;`;
  const fileAST = parseText(query);

  const parameters = {
    user: {name: "Bob", age: 12},
  };

  const expectedInterpolationResult = {
    query: "INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id",
    bindings: ["Bob", 12],
    mapping: [],
  };

  const expectedMappingResult = {
    query: "INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id",
    bindings: [],
    mapping: [{
      name: "user",
      type: ParamTransform.Pick,
      dict: {
        name: {
          assignedIndex: 1,
          name: "name",
          type: ParamTransform.Scalar,
        },
        age: {
          assignedIndex: 2,
          name: "age",
          type: ParamTransform.Scalar,
        },
      }
    }],
  };

  const interpolationResult = processQueryAST(fileAST.parseTree.queries[0], parameters);
  expect(interpolationResult).toEqual(expectedInterpolationResult);

  const mappingResult = processQueryAST(fileAST.parseTree.queries[0]);
  expect(mappingResult).toEqual(expectedMappingResult);
});

test("(AST) pickSpread param", () => {
  const query = `
  /*
    @name insertUsers
    @param users -> ((name, age)...)
  */
  INSERT INTO users (name, age) VALUES :users RETURNING id;`;
  const fileAST = parseText(query);

  const parameters = {
    users: [
      {name: "Bob", age: 12},
      {name: "Tom", age: 22},
    ],
  };

  const expectedInterpolationResult = {
    query: "INSERT INTO users (name, age) VALUES ($1,$2),($3,$4) RETURNING id",
    bindings: ["Bob", 12, "Tom", 22],
    mapping: [],
  };

  const expectedMapping = [
    {
      name: "users",
      type: ParamTransform.PickSpread,
      dict: {
        name: {name: "name", type: ParamTransform.Scalar, assignedIndex: 1},
        age: {name: "age", type: ParamTransform.Scalar, assignedIndex: 2},
      },
    },
  ];

  const expectedMappingResult = {
    query: "INSERT INTO users (name, age) VALUES ($1,$2) RETURNING id",
    bindings: [],
    mapping: expectedMapping,
  };

  const interpolationResult = processQueryAST(fileAST.parseTree.queries[0], parameters);
  const mappingResult = processQueryAST(fileAST.parseTree.queries[0]);

  expect(interpolationResult).toEqual(expectedInterpolationResult);
  expect(mappingResult).toEqual(expectedMappingResult);
});
