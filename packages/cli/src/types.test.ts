import { DefaultTypeMapping, TypeAllocator } from './types';

describe('TypeAllocator', () => {
  test('Allows overrides', () => {
    const types = new TypeAllocator({
      ...DefaultTypeMapping,
      foo: { name: 'bar' },
    });
    expect(types.use('foo')).toEqual('bar');
  });
});
