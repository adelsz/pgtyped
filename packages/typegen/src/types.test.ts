import { TypeAllocator, TypeMapping, TypeScope } from './types.js';

describe('TypeAllocator', () => {
  test('Allows overrides', () => {
    const types = new TypeAllocator(
      TypeMapping({
        foo: { return: { name: 'bar' }, parameter: { name: 'baz' } },
      }),
    );
    expect(types.use('foo', TypeScope.Return)).toEqual('bar');
    expect(types.use('foo', TypeScope.Parameter)).toEqual('baz');
  });

  // Covers issue #323
  test('Uses `Json` when using `JsonArray`', () => {
    const types = new TypeAllocator(TypeMapping());
    // `_json` is the type name from PG corresponding to an array of JSON values
    types.use('_json', TypeScope.Return);
    // The definition of `JsonArray` depends on the definition of `Json`, so we
    // expect both to be included
    expect(types.types).toMatchObject({
      Json: expect.objectContaining({ name: 'Json' }),
      JsonArray: expect.objectContaining({ name: 'JsonArray' }),
    });
  });
});
