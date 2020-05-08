export type Type = NamedType | ImportedType | AliasedType | EnumType;
// May be a database source type name (string) or a typescript destination type (Type)
export type MappableType = string | Type;

export interface NamedType {
  name: string;
  definition?: string;
  enumValues?: string[];
}

export interface ImportedType extends NamedType {
  from: string;
}

export interface AliasedType extends NamedType {
  definition: string;
}

export interface EnumType extends NamedType {
  enumValues: string[];
}

export function isImport(typ: Type): typ is ImportedType {
  return 'from' in typ;
}

export function isAlias(typ: Type): typ is AliasedType {
  return 'definition' in typ;
}

export function isEnum(typ: MappableType): typ is EnumType {
  return typeof typ !== 'string' && 'enumValues' in typ;
}

export const enum DatabaseTypeKind {
  Base = 'b',
  Composite = 'c',
  Domain = 'd',
  Enum = 'e',
  Pseudo = 'p',
  Range = 'r',
}
