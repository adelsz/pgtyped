import { declareImport } from './types.js';

test('default', () => {
  expect(
    declareImport(
      [{ name: 'Alias', from: 'package', aliasOf: 'default' }],
      './',
    ),
  ).toBe("import Alias from 'package';\n");
});

test('named', () => {
  expect(
    declareImport(
      [
        { name: 'Foo', from: 'package' },
        { name: 'Bar', from: 'package' },
        { name: 'Baz', from: 'package', aliasOf: 'Baz' },
      ],
      './',
    ),
  ).toBe("import { Foo, Bar, Baz } from 'package';\n");
});

test('named aliased', () => {
  expect(
    declareImport(
      [
        { name: 'Alias1', from: 'package', aliasOf: 'Foo' },
        { name: 'Alias2', from: 'package', aliasOf: 'Bar' },
      ],
      './',
    ),
  ).toBe("import { Foo as Alias1, Bar as Alias2 } from 'package';\n");
});

test('mix', () => {
  expect(
    declareImport(
      [
        { name: 'Alias', from: 'package', aliasOf: 'default' },
        { name: 'Alias1', from: 'package', aliasOf: 'Foo' },
        { name: 'Bar', from: 'package' },
        { name: 'Alias2', from: 'package', aliasOf: 'Baz' },
      ],
      './',
    ),
  ).toBe(
    "import Alias, { Foo as Alias1, Bar, Baz as Alias2 } from 'package';\n",
  );
});

describe('relative imports', () => {
  test('sub dir', () => {
    expect(
      declareImport(
        [{ name: 'Alias', from: './my/custom/path', aliasOf: 'default' }],
        './my/file.ts',
      ),
    ).toBe("import Alias from './custom/path';\n");
  });

  test('parent dir', () => {
    expect(
      declareImport(
        [{ name: 'Alias', from: './my/custom/path', aliasOf: 'default' }],
        './foo/bar/file.ts',
      ),
    ).toBe("import Alias from '../../my/custom/path';\n");
  });

  test('parent parent dir', () => {
    expect(
      declareImport(
        [{ name: 'Alias', from: '../my/custom/path', aliasOf: 'default' }],
        './foo/bar/file.ts',
      ),
    ).toBe("import Alias from '../../../my/custom/path';\n");
  });

  test('sub dir with extension', () => {
    expect(
      declareImport(
        [{ name: 'Alias', from: './my/custom/path.js', aliasOf: 'default' }],
        './my/file.ts',
      ),
    ).toBe("import Alias from './custom/path.js';\n");
  });

  test('parent dir with extension', () => {
    expect(
      declareImport(
        [{ name: 'Alias', from: './my/custom/path.ts', aliasOf: 'default' }],
        './foo/bar/file.ts',
      ),
    ).toBe("import Alias from '../../my/custom/path.ts';\n");
  });

  test('parent parent dir with extension', () => {
    expect(
      declareImport(
        [{ name: 'Alias', from: '../my/custom/path.ts', aliasOf: 'default' }],
        './foo/bar/file.ts',
      ),
    ).toBe("import Alias from '../../../my/custom/path.ts';\n");
  });
});
