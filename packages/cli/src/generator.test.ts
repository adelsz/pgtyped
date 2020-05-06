import * as queryModule from '@pgtyped/query';
import { parseSQLFile } from '@pgtyped/query';
import { IQueryTypes } from '@pgtyped/query/lib/actions';
import { generateInterface, queryToTypeDeclarations } from './generator';
import { ProcessingMode } from './index';
import { DefaultTypeMapping, TypeAllocator } from './types';

const getTypesMocked = jest.spyOn(queryModule, 'getTypes').mockName('getTypes');

describe('query-to-interface translation (SQL)', () => {
  test('TypeMapping and declarations', async () => {
    const queryString = `
    /* @name GetNotifications */
    SELECT payload FROM notifications WHERE id = :userId;
    `;
    const mockTypes: IQueryTypes = {
      returnTypes: [
        {
          returnName: 'payload',
          columnName: 'payload',
          type: 'json',
          nullable: false,
        },
      ],
      paramMetadata: {
        params: ['uuid'],
        mapping: [
          {
            name: 'id',
            type: queryModule.ParamTransform.Scalar,
            assignedIndex: 1,
          },
        ],
      },
    };
    getTypesMocked.mockResolvedValue(mockTypes);
    const query = parseSQLFile(queryString);
    const types = new TypeAllocator(DefaultTypeMapping);
    // Test out imports
    types.use({ name: 'PreparedQuery', from: '@pgtyped/query' });
    const result = await queryToTypeDeclarations(
      {
        ast: query.parseTree.queries[0],
        mode: ProcessingMode.SQL,
      },
      null,
      types,
    );
    const expectedTypes = `import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };\n`;

    expect(types.declaration()).toEqual(expectedTypes);
    const expected = `/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  id: string | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  payload: Json;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}\n\n`;
    expect(result).toEqual(expected);
  });
  test('DeleteUsers by UUID', async () => {
    const queryString = `
    /* @name DeleteUsers */
      delete from users * where name = :userName and id = :userId and note = :userNote returning id, id, name, note as bote;
    `;
    const mockTypes: IQueryTypes = {
      returnTypes: [
        {
          returnName: 'id',
          columnName: 'id',
          type: 'uuid',
          nullable: false,
        },
        {
          returnName: 'name',
          columnName: 'name',
          type: 'text',
          nullable: false,
        },
        {
          returnName: 'bote',
          columnName: 'note',
          type: 'text',
          nullable: true,
        },
      ],
      paramMetadata: {
        params: ['uuid', 'text'],
        mapping: [
          {
            name: 'id',
            type: queryModule.ParamTransform.Scalar,
            assignedIndex: 1,
          },
          {
            name: 'userName',
            type: queryModule.ParamTransform.Scalar,
            assignedIndex: 2,
          },
        ],
      },
    };
    getTypesMocked.mockResolvedValue(mockTypes);
    const query = parseSQLFile(queryString);
    const result = await queryToTypeDeclarations(
      {
        ast: query.parseTree.queries[0],
        mode: ProcessingMode.SQL,
      },
      null,
    );
    const expected = `/** 'DeleteUsers' parameters type */
export interface IDeleteUsersParams {
  id: string | null | void;
  userName: string | null | void;
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
});

test('query-to-interface translation (TS)', async () => {
  const query = `
    DELETE
      FROM users *
     WHERE NAME = :userName AND id = :userId AND note = :userNote RETURNING id, id, NAME, note AS bote;
  `;
  const mockTypes: IQueryTypes = {
    returnTypes: [
      {
        returnName: 'id',
        columnName: 'id',
        type: 'uuid',
        nullable: false,
      },
      {
        returnName: 'name',
        columnName: 'name',
        type: 'text',
        nullable: false,
      },
      {
        returnName: 'bote',
        columnName: 'note',
        type: 'text',
        nullable: true,
      },
    ],
    paramMetadata: {
      params: ['uuid', 'text'],
      mapping: [
        {
          name: 'id',
          type: queryModule.ParamTransform.Scalar,
          assignedIndex: 1,
        },
        {
          name: 'userName',
          type: queryModule.ParamTransform.Scalar,
          assignedIndex: 2,
        },
      ],
    },
  };
  getTypesMocked.mockResolvedValue(mockTypes);
  const result = await queryToTypeDeclarations(
    {
      name: 'DeleteUsers',
      body: query,
      mode: ProcessingMode.TS,
    },
    null,
  );
  const expected = `/** 'DeleteUsers' parameters type */
export interface IDeleteUsersParams {
  id: string | null | void;
  userName: string | null | void;
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

test('interface generation', () => {
  const expected = `export interface User {
  name: string;
  age: number;
}

`;
  const fields = [
    {
      fieldName: 'name',
      fieldType: 'string',
    },
    {
      fieldName: 'age',
      fieldType: 'number',
    },
  ];
  const result = generateInterface('User', fields);
  expect(result).toEqual(expected);
});
