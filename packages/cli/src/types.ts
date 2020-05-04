export type Type =
  | NamedType
  | ImportedType
  | AliasedType;

export interface NamedType {
  name: string
  definition?: string
}

export interface ImportedType extends NamedType {
  from: string
}

export interface AliasedType extends NamedType {
  definition: string
}

function isImport(typ: Type): typ is ImportedType {
  return 'from' in typ;
}

function isAlias(typ: Type): typ is AliasedType {
  return 'definition' in typ;
}

// Default types
const String: Type = { name: 'string' };
const Number: Type = { name: 'number' };
const Boolean: Type = { name: 'boolean' };
const Date: Type = { name: 'Date' };
const Bytes: Type = { name: 'Buffer' };
const Json: Type = {
  name: 'Json',
  definition: 'null | boolean | number | string | Json[] | { [key: string]: Json }',
};

export const DefaultTypeMapping = Object.freeze({
  // Integer types
  int2: Number,
  int4: Number,
  int8: Number,
  smallint: Number,
  int: Number,
  bigint: Number,

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
  bigserial: Number,

  // Common string types
  uuid: String,
  text: String,
  varchar: String,
  char: String,

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

  // Extra types
  money: Number,

  // JSON types
  json: Json,
  jsonb: Json,

  // Bytes
  bytea: Bytes,
});

export type BuiltinTypes = keyof typeof DefaultTypeMapping;

export type TypeMapping = {
  [postgresType in BuiltinTypes]: Type;
};

export function TypeMapping(overrides?: Partial<TypeMapping>): TypeMapping {
  return { ...DefaultTypeMapping, ...overrides };
}

function declareAlias(name: string, definition: string): string {
  return `export type ${name} = ${definition};\n`;
}

function declareImport(names: string[], from: string): string {
  return `import { ${names.join(', ')} } from '${from}';\n`;
}

/** Wraps a TypeMapping to track which types have been used, to accumulate errors,
 * and emit necessary type definitions. */
export class TypeAllocator {
  errors: Error[] = [];
  // from -> names
  imports: { [k: string]: string[] } = {};
  // name -> definition (if any)
  types: { [k: string]: string } = {};

  constructor(
    private mapping: TypeMapping,
    private allowUnmappedTypes?: boolean,
  ) {
  }

  isMappedType(name: string): name is BuiltinTypes {
    return name in this.mapping;
  }

  /** Lookup a database-provided type name in the allocator's map */
  use(typeNameOrType: string | Type): string {
    let typ: Type;

    if (typeof typeNameOrType == 'string') {
      if (!this.isMappedType(typeNameOrType)) {
        if (this.allowUnmappedTypes) {
          return typeNameOrType;
        }
        this.errors.push(
          new Error(`Postgres type '${typeNameOrType}' is not supported by mapping`),
        );
        return 'never';
      }
      typ = this.mapping[typeNameOrType];
    } else {
      typ = typeNameOrType;
    }

    // If first time we have seen this type then track its use
    if (!(typ.name in this.types)) {
      this.types[typ.name] = typ.definition ? typ.definition : '';

      if (isImport(typ)) {
        if (typ.from in this.imports) {
          // Merge imports with same path
          this.imports[typ.from].push(typ.name);
        } else {
          this.imports[typ.from] = [typ.name];
        }
      }
    }

    return typ.name;
  }

  /** Emit a typescript definition for all types that have been used */
  declaration(): string {
    const imports = Object.entries(this.imports)
      .map(([from, names]) => declareImport(names, from))
      .join('\n');

    const aliases = Object.entries(this.types)
      .filter(([_, definition]) => definition)
      .map(([name, definition]) => declareAlias(name, definition))
      .join('\n');

    return [imports, aliases].filter(s => s).join('\n');
  }

  async check() {
    if (this.errors.length > 0) {
      throw new Error(
        `Errors with types used in generation:\n\t${this.errors.join('\n\t')}`,
      );
    }
  }
}
