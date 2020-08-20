// Default types
import {
  isAlias,
  isEnum,
  isImport,
  MappableType,
  Type,
} from '@pgtyped/query/lib/type';

const String: Type = { name: 'string' };
const Number: Type = { name: 'number' };
const Boolean: Type = { name: 'boolean' };
const Date: Type = { name: 'Date' };
const Bytes: Type = { name: 'Buffer' };
const Void: Type = { name: 'undefined' };
const Json: Type = {
  name: 'Json',
  definition:
    'null | boolean | number | string | Json[] | { [key: string]: Json }',
};
const getArray = (baseType: Type): Type => ({
  name: `${baseType.name}Array`,
  definition: `(${baseType.definition ?? baseType.name})[]`,
});

export const DefaultTypeMapping = Object.freeze({
  // Integer types
  int2: Number,
  int4: Number,
  int8: String,
  smallint: Number,
  int: Number,
  bigint: String,

  // Precision types
  real: Number,
  float4: Number,
  float: Number,
  float8: Number,
  numeric: Number,
  decimal: Number,

  // Serial types
  smallserial: Number,
  serial: Number,
  bigserial: String,

  // Common string types
  uuid: String,
  text: String,
  varchar: String,
  char: String,
  bpchar: String,
  citext: String,

  // Bool types
  bit: Boolean, // TODO: better bit array support
  bool: Boolean,
  boolean: Boolean,

  // Dates and times
  date: Date,
  timestamp: Date,
  timestamptz: Date,
  time: Date,
  timetz: Date,
  interval: String,

  // Network address types
  inet: String,
  cidr: String,
  macaddr: String,
  macaddr8: String,

  // Extra types
  money: Number,
  void: Void,

  // JSON types
  json: Json,
  jsonb: Json,

  // Bytes
  bytea: Bytes,
});

export type BuiltinTypes = keyof typeof DefaultTypeMapping;

export type TypeMapping = Record<BuiltinTypes, Type> & Record<string, Type>;

export function TypeMapping(overrides?: Partial<TypeMapping>): TypeMapping {
  return { ...DefaultTypeMapping, ...overrides };
}

function declareImport([...names]: Set<string>, from: string): string {
  return `import { ${names.join(', ')} } from '${from}';\n`;
}

function declareAlias(name: string, definition: string): string {
  return `export type ${name} = ${definition};\n`;
}

function declareStringUnion(name: string, values: string[]) {
  return declareAlias(name, values.map((v) => `'${v}'`).join(' | '));
}

function declareEnum(name: string, values: string[]) {
  return `export const enum ${name} {\n${values
    .map((v) => `  ${v} = '${v}',`)
    .join('\n')}\n}\n`;
}

/** Wraps a TypeMapping to track which types have been used, to accumulate errors,
 * and emit necessary type definitions. */
export class TypeAllocator {
  errors: Error[] = [];
  // from -> names
  imports: { [k: string]: Set<string> } = {};
  // name -> definition (if any)
  types: { [k: string]: Type } = {};

  constructor(
    private mapping: TypeMapping,
    private allowUnmappedTypes?: boolean,
  ) {}

  isMappedType(name: string): name is keyof TypeMapping {
    return name in this.mapping;
  }

  /** Lookup a database-provided type name in the allocator's map */
  use(typeNameOrType: MappableType): string {
    let typ: Type | null = null;

    if (typeof typeNameOrType == 'string') {
      if (typeNameOrType[0] === '_') {
        // If starts with _ it is an PG Array type

        const arrayValueType = typeNameOrType.slice(1);
        // ^ Converts _varchar -> varchar, then wraps the type in an array
        // type wrapper
        if (this.isMappedType(arrayValueType)) {
          typ = getArray(this.mapping[arrayValueType]);
        }
      }

      if (typ == null) {
        if (!this.isMappedType(typeNameOrType)) {
          if (this.allowUnmappedTypes) {
            return typeNameOrType;
          }
          this.errors.push(
            new Error(
              `Postgres type '${typeNameOrType}' is not supported by mapping`,
            ),
          );
          return 'never';
        }
        typ = this.mapping[typeNameOrType];
      }
    } else {
      typ = typeNameOrType;
    }

    // Track type on first occurrence
    this.types[typ.name] = this.types[typ.name] ?? typ;

    // Merge imports
    if (isImport(typ)) {
      this.imports[typ.from] = (this.imports[typ.from] ?? new Set()).add(
        typ.name,
      );
    }

    return typ.name;
  }

  /** Emit a typescript definition for all types that have been used */
  declaration(): string {
    const imports = Object.entries(this.imports)
      .map(([from, names]) => declareImport(names, from))
      .join('\n');

    // Declare database enums as string unions to maintain assignability of their values between query files
    const enums = Object.values(this.types)
      .filter(isEnum)
      .map((t) => declareStringUnion(t.name, t.enumValues))
      .join('\n');

    const aliases = Object.values(this.types)
      .filter(isAlias)
      .map((t) => declareAlias(t.name, t.definition))
      .join('\n');

    return [imports, enums, aliases].filter((s) => s).join('\n');
  }
}
