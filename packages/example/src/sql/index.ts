import { sql as sourceSql } from '@pgtyped/runtime';



export function sql(s: string): unknown;
export function sql(s: string): unknown {
  return sourceSql([s] as any);
}