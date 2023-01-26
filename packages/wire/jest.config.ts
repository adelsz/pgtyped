import type { Config } from 'jest';

const config: Config = {
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
  roots: ['src'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  preset: 'ts-jest/presets/default-esm',
  testRegex: '\\.test\\.tsx?$',
};

export default config;
