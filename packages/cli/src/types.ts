// Default types
import {
  isAlias,
  isEnum,
  isEnumArray,
  isImport,
  MappableType,
  Type,
  ImportedType,
} from '@pgtyped/query';
import path from 'path';

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
  numeric: String,
  decimal: String,

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
  name: String,

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
  money: String,
  tsvector: String,
  void: Void,

  // JSON types
  json: Json,
  jsonb: Json,

  // Bytes
  bytea: Bytes,

  // Postgis types
  point: getArray(Number),
});

export type BuiltinTypes = keyof typeof DefaultTypeMapping;

export type TypeDefinition = { parameter: Type; return: Type };

export type TypeMapping = Record<BuiltinTypes, TypeDefinition> &
  Record<string, TypeDefinition>;

export function TypeMapping(
  overrides: Record<string, Partial<TypeDefinition>> = {},
): TypeMapping {
  const output = { ...overrides };

  for (const typeName of Object.keys(DefaultTypeMapping)) {
    output[typeName] = {
      parameter:
        overrides[typeName]?.parameter ??
        DefaultTypeMapping[typeName as BuiltinTypes],
      return:
        overrides[typeName]?.return ??
        DefaultTypeMapping[typeName as BuiltinTypes],
    };
  }

  return output as TypeMapping;
}

export function declareImport(
  imports: ImportedType[],
  decsFileName: string,
): string {
  // name => alias
  const names = new Map<string, string>();
  let defaultImportAlias: string | null = null;

  for (const imp of imports) {
    if (imp.aliasOf === 'default') {
      defaultImportAlias ??= imp.name;

      if (imp.name !== defaultImportAlias) {
        throw new Error(
          `Default import from package "${imp.from}" is aliased differently multiple times (${imp.name} and ${defaultImportAlias})`,
        );
      }

      continue;
    }

    const namedImport = imp.aliasOf ?? imp.name;

    if (!names.has(namedImport)) {
      names.set(namedImport, imp.name);
    } else if (names.get(namedImport) !== imp.name) {
      throw new Error(
        `Import ${namedImport} from package "${
          imp.from
        }" is aliased differently multiple times (${imp.name} and ${names.get(
          namedImport,
        )})`,
      );
    }
  }

  let from = imports[0].from;

  if (from.startsWith('.')) {
    from = path.relative(path.dirname(decsFileName), imports[0].from);

    if (!from.startsWith('.')) {
      from = './' + from;
    }
  }

  const parts = ['import'];
  const subParts = [];

  if (defaultImportAlias) {
    subParts.push(defaultImportAlias);
  }

  if (names.size) {
    subParts.push(
      `{ ${[...names.entries()]
        .map(([name, alias]) => (name === alias ? name : `${name} as ${alias}`))
        .join(', ')} }`,
    );
  }

  parts.push(subParts.join(', '));
  parts.push(`from '${from}';\n`);

  return parts.join(' ');
}

function declareAlias(name: string, definition: string): string {
  return `export type ${name} = ${definition};\n`;
}

function declareStringUnion(name: string, values: string[]) {
  return declareAlias(
    name,
    values
      .sort()
      .map((v) => `'${v}'`)
      .join(' | '),
  );
}

/** Wraps a TypeMapping to track which types have been used, to accumulate errors,
 * and emit necessary type definitions. */
export class TypeAllocator {
  errors: Error[] = [];
  // from -> ImportedType[]
  imports: { [k: string]: ImportedType[] } = {};
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
  use(typeNameOrType: MappableType, scope: 'parameter' | 'return'): string {
    let typ: Type | null = null;

    if (typeof typeNameOrType == 'string') {
      if (typeNameOrType[0] === '_') {
        // If starts with _ it is an PG Array type

        const arrayValueType = typeNameOrType.slice(1);
        // ^ Converts _varchar -> varchar, then wraps the type in an array
        // type wrapper
        if (this.isMappedType(arrayValueType)) {
          typ = getArray(this.mapping[arrayValueType][scope]);
          // make sure the element type is used so it appears in the declaration
          this.use(this.mapping[arrayValueType][scope], scope);
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
          return 'unknown';
        }
        typ = this.mapping[typeNameOrType][scope];
      }
    } else {
      if (isEnumArray(typeNameOrType)) {
        typ = getArray(typeNameOrType.elementType);
        // make sure the element type is used so it appears in the declaration
        this.use(typeNameOrType.elementType, scope);
      } else {
        typ = typeNameOrType;
      }
    }

    // Track type on first occurrence
    this.types[typ.name] = this.types[typ.name] ?? typ;

    // Merge imports
    if (isImport(typ)) {
      this.imports[typ.from] = this.imports[typ.from] ?? [];
      this.imports[typ.from].push(typ);
    }

    return typ.name;
  }

  /** Emit a typescript definition for all types that have been used */
  declaration(decsFileName: string): string {
    const imports = Object.values(this.imports)
      .map((imports) => declareImport(imports, decsFileName))
      .sort()
      .join('\n');

    // Declare database enums as string unions to maintain assignability of their values between query files
    const enums = Object.values(this.types)
      .filter(isEnum)
      .map((t) => declareStringUnion(t.name, t.enumValues))
      .sort()
      .join('\n');

    const aliases = Object.values(this.types)
      .filter(isAlias)
      .map((t) => declareAlias(t.name, t.definition))
      .sort()
      .join('\n');

    return [imports, enums, aliases].filter((s) => s).join('\n');
  }
}
