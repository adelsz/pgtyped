import { stringToType } from './config.js';

export {};

test('typescript type', () => {
  expect(stringToType('string | boolean')).toEqual({
    name: 'string | boolean',
  });
});

test('relative imports should have alias or named import', () => {
  expect(() => stringToType('./relative')).toThrow();
});

test('relative import default', () => {
  expect(stringToType('./relative as DefaultImport')).toEqual({
    name: 'DefaultImport',
    from: './relative',
    aliasOf: 'default',
  });
});

test('relative named import', () => {
  expect(stringToType('./relative#NamedImport')).toEqual({
    name: 'NamedImport',
    from: './relative',
  });
});

test('relative named import alias', () => {
  expect(stringToType('./relative#NamedImport as AliasedImport')).toEqual({
    name: 'AliasedImport',
    from: './relative',
    aliasOf: 'NamedImport',
  });
});

test('relative import default with extension', () => {
  expect(stringToType('./relative.ts as DefaultImport')).toEqual({
    name: 'DefaultImport',
    from: './relative.ts',
    aliasOf: 'default',
  });
});

test('relative named import with extension', () => {
  expect(stringToType('./relative.js#NamedImport')).toEqual({
    name: 'NamedImport',
    from: './relative.js',
  });
});

test('relative named import alias with extension', () => {
  expect(stringToType('./relative.ts#NamedImport as AliasedImport')).toEqual({
    name: 'AliasedImport',
    from: './relative.ts',
    aliasOf: 'NamedImport',
  });
});

test('named import', () => {
  expect(stringToType('my-package#NamedImport')).toEqual({
    name: 'NamedImport',
    from: 'my-package',
  });
});

test('named import alias', () => {
  expect(stringToType('my-package#NamedImport as AliasedImport')).toEqual({
    name: 'AliasedImport',
    from: 'my-package',
    aliasOf: 'NamedImport',
  });
});

test('import alias', () => {
  expect(stringToType('my-package as AliasedImport')).toEqual({
    name: 'AliasedImport',
    from: 'my-package',
    aliasOf: 'default',
  });
});
