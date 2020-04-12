import * as queryModule from "@pgtyped/query";
import {generateInterface, queryToTypeDeclarations,} from "./generator";
import {ProcessingMode} from "./index";
import {parseSQLFile} from "@pgtyped/query";

const getTypesMocked = jest
  .spyOn(queryModule, "getTypes")
  .mockName("getTypes");

test("query-to-interface translation (SQL)", async () => {
  const queryString = `
    /* @name DeleteUsers */
      delete from users * where name = :userName and id = :userId and note = :userNote returning id, id, name, note as bote;
    `;
  const mockTypes = {
    returnTypes: [
      {
        returnName: "id",
        columnName: "id",
        typeName: "uuid",
        nullable: false,
      },
      {
        returnName: "name",
        columnName: "name",
        typeName: "text",
        nullable: false,
      },
      {
        returnName: "bote",
        columnName: "note",
        typeName: "text",
        nullable: true,
      },
    ],
    paramMetadata: {
      params: ["uuid", "text"],
      mapping: [
        { name: "id", type: queryModule.ParamTransform.Scalar, assignedIndex: 1 },
        { name: "userName", type: queryModule.ParamTransform.Scalar, assignedIndex: 2 },
      ],
    },
  };
  getTypesMocked.mockResolvedValue(mockTypes as any);
  const query = parseSQLFile(queryString);
  const result = await queryToTypeDeclarations({
    ast: query.parseTree.queries[0],
    mode: ProcessingMode.SQL,
  }, null);
  const expected = `/** 'DeleteUsers' parameters type */
export interface IDeleteUsersParams {
  id: string | null;
  userName: string | null;
}

/** 'DeleteUsers' return type */
export interface IDeleteUsersResult {
  id: string;
  name: string;
  bote: string | null;
}

/** 'DeleteUsers' query type */
export interface IDeleteUsersQuery {
  params: IDeleteUsersParams;
  result: IDeleteUsersResult;
}

`;
  expect(result).toEqual(expected);
});

test("query-to-interface translation (TS)", async () => {
  const query = `
      delete from users *
      where name = :userName and id = :userId and note = :userNote returning id, id, name, note as bote;
    `;
  const mockTypes = {
    returnTypes: [
      {
        returnName: "id",
        columnName: "id",
        typeName: "uuid",
        nullable: false,
      },
      {
        returnName: "name",
        columnName: "name",
        typeName: "text",
        nullable: false,
      },
      {
        returnName: "bote",
        columnName: "note",
        typeName: "text",
        nullable: true,
      },
    ],
    paramMetadata: {
      params: ["uuid", "text"],
      mapping: [
        { name: "id", type: queryModule.ParamTransform.Scalar, assignedIndex: 1 },
        { name: "userName", type: queryModule.ParamTransform.Scalar, assignedIndex: 2 },
      ],
    },
  };
  getTypesMocked.mockResolvedValue(mockTypes as any);
  const result = await queryToTypeDeclarations({
    name: "DeleteUsers",
    body: query,
    mode: ProcessingMode.TS,
  }, null);
  const expected = `/** 'DeleteUsers' parameters type */
export interface IDeleteUsersParams {
  id: string | null;
  userName: string | null;
}

/** 'DeleteUsers' return type */
export interface IDeleteUsersResult {
  id: string;
  name: string;
  bote: string | null;
}

/** 'DeleteUsers' query type */
export interface IDeleteUsersQuery {
  params: IDeleteUsersParams;
  result: IDeleteUsersResult;
}

`;
  expect(result).toEqual(expected);
});

test("interface generation", () => {
  const expected =
    `export interface User {
  name: string;
  age: number;
}

`;
  const fields = [{
    fieldName: "name",
    fieldType: "string",
  }, {
    fieldName: "age",
    fieldType: "number",
  }];
  const result = generateInterface("User", fields);
  expect(result).toEqual(expected);
});
