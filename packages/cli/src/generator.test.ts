import * as queryModule from '@pgtyped/query';
import { parseSQLFile } from '@pgtyped/query';
import { IQueryTypes } from '@pgtyped/query/lib/actions';
import { generateInterface, queryToTypeDeclarations } from './generator';
import { ProcessingMode } from './index';
import { DefaultTypeMapping, TypeAllocator } from './types';
import { ParsedConfig } from './config';

const getTypesMocked = jest.spyOn(queryModule, 'getTypes').mockName('getTypes');

function parsedQuery(
  mode: ProcessingMode,
  name: string,
  queryString: string,
): Parameters<typeof queryToTypeDeclarations>[0] {
  return mode === ProcessingMode.SQL
    ? { mode, ast: parseSQLFile(queryString).parseTree.queries[0] }
    : { mode, name, body: queryString };
}

describe('query-to-interface translation', () => {
  [ProcessingMode.SQL, ProcessingMode.TS].forEach((mode) => {
    test(`TypeMapping and declarations (${mode})`, async () => {
      const queryString = `
    /* @name GetNotifications */
    SELECT payload, type FROM notifications WHERE id = :userId;
    `;
      const mockTypes: IQueryTypes = {
        returnTypes: [
          {
            returnName: 'payload',
            columnName: 'payload',
            type: 'json',
            nullable: false,
          },
          {
            returnName: 'type',
            columnName: 'type',
            type: { name: 'PayloadType', enumValues: ['message', 'dynamite'] },
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
      const types = new TypeAllocator(DefaultTypeMapping);
      // Test out imports
      types.use({ name: 'PreparedQuery', from: '@pgtyped/query' });
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, 'GetNotifications', queryString),
        null,
        types,
        {} as ParsedConfig,
      );
      const expectedTypes = `import { PreparedQuery } from '@pgtyped/query';

export type PayloadType = 'message' | 'dynamite';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };\n`;

      expect(types.declaration()).toEqual(expectedTypes);
      const expected = `/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  id: string | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  payload: Json;
  type: PayloadType;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}\n\n`;
      expect(result).toEqual(expected);
    });

    test(`DeleteUsers by UUID (${mode})`, async () => {
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
      const types = new TypeAllocator(DefaultTypeMapping);
      getTypesMocked.mockResolvedValue(mockTypes);
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, 'DeleteUsers', queryString),
        null,
        types,
        {} as ParsedConfig,
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

    test(`TypeMapping and declarations camelCase (${mode})`, async () => {
      const queryString = `
    /* @name GetNotifications */
    SELECT payload, type FROM notifications WHERE id = :userId;
    `;
      const mockTypes: IQueryTypes = {
        returnTypes: [
          {
            returnName: 'payload_camel_case',
            columnName: 'payload',
            type: 'json',
            nullable: false,
          },
          {
            returnName: 'type_camel_case',
            columnName: 'type',
            type: { name: 'PayloadType', enumValues: ['message', 'dynamite'] },
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
      const types = new TypeAllocator(DefaultTypeMapping);
      // Test out imports
      types.use({ name: 'PreparedQuery', from: '@pgtyped/query' });
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, 'GetNotifications', queryString),
        null,
        types,
        { camelCaseColumnNames: true } as ParsedConfig,
      );
      const expectedTypes = `import { PreparedQuery } from '@pgtyped/query';

export type PayloadType = 'message' | 'dynamite';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };\n`;

      expect(types.declaration()).toEqual(expectedTypes);
      const expected = `/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  id: string | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  payloadCamelCase: Json;
  typeCamelCase: PayloadType;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}\n\n`;
      expect(result).toEqual(expected);
    });
  });
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
