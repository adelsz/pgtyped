import { DefaultTypeMapping, TypeAllocator } from './types';

describe('TypeAllocator', () => {
  test('Allows overrides', () => {
    const types = new TypeAllocator({
      ...DefaultTypeMapping,
      foo: { name: 'bar' },
    });
    expect(types.use('foo')).toEqual('bar');
  });

  // Covers issue #323
  test('Uses `Json` when using `JsonArray`', () => {
    const types = new TypeAllocator(DefaultTypeMapping);
    // `_json` is the type name from PG corresponding to an array of JSON values
    types.use('_json');
    // The definition of `JsonArray` depends on the definition of `Json`, so we
    // expect both to be included
    expect(types.types).toMatchObject({
      Json: expect.objectContaining({ name: 'Json' }),
      JsonArray: expect.objectContaining({ name: 'JsonArray' }),
    });
  });
});
