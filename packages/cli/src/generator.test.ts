import * as queryModule from "@pgtyped/query";
import {
  FieldType, generateInterface, queryToTypeDeclarations,
} from "./generator";

const getTypesMocked = jest
  .spyOn(queryModule, "getTypes")
  .mockName("getTypes");

test("test query to interface", async () => {
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
        { name: "id", type: queryModule.ParamType.Scalar, assignedIndex: 1 },
        { name: "userName", type: queryModule.ParamType.Scalar, assignedIndex: 2 },
      ],
    },
  };
  getTypesMocked.mockResolvedValue(mockTypes as any);
  const result = await queryToTypeDeclarations({
    name: "DeleteUsers",
    body: query,
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
