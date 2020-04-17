import debugBase from 'debug';
export const debug = debugBase('pg-typegen');

export function assert(condition: any): asserts condition {
  if (!condition) {
    throw new Error('Assertion Failed');
  }
}
