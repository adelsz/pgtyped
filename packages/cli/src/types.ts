// Default types
import {
  ImportedType,
  isAlias,
  isEnum,
  isEnumArray,
  isImport,
  MappableType,
  Type,
} from '@pgtyped/query';
import os from 'os';
import { AliasedType, EnumType } from '@pgtyped/query/lib/type.js';
import path from 'path';

const String: Type = { name: 'string' };
const Number: Type = { name: 'number' };
const NumberOrString: Type = {
  name: 'NumberOrString',
  definition: 'number | string',
};
const Boolean: Type = { name: 'boolean' };
const Date: Type = { name: 'Date' };
const DateOrString: Type = {
  name: 'DateOrString',
  definition: 'Date | string',
};
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
  int2: { parameter: Number, return: Number },
  int4: { parameter: Number, return: Number },
  int8: { parameter: NumberOrString, return: String },
  smallint: { parameter: Number, return: Number },
  int: { parameter: Number, return: Number },
  bigint: { parameter: NumberOrString, return: String },

  // Precision types
  real: { parameter: Number, return: Number },
  float4: { parameter: Number, return: Number },
  float: { parameter: Number, return: Number },
  float8: { parameter: Number, return: Number },
  numeric: { parameter: NumberOrString, return: String },
  decimal: { parameter: NumberOrString, return: String },

  // Serial types
  smallserial: { parameter: Number, return: Number },
  serial: { parameter: Number, return: Number },
  bigserial: { parameter: NumberOrString, return: String },

  // Common string types
  uuid: { parameter: String, return: String },
  text: { parameter: String, return: String },
  varchar: { parameter: String, return: String },
  char: { parameter: String, return: String },
  bpchar: { parameter: String, return: String },
  citext: { parameter: String, return: String },
  name: { parameter: String, return: String },

  // Bool types
  bit: { parameter: Boolean, return: Boolean }, // TODO: { parameter: better, return: better } bit array support
  bool: { parameter: Boolean, return: Boolean },
  boolean: { parameter: Boolean, return: Boolean },

  // Dates and times
  date: { parameter: DateOrString, return: Date },
  timestamp: { parameter: DateOrString, return: Date },
  timestamptz: { parameter: DateOrString, return: Date },
  time: { parameter: DateOrString, return: Date },
  timetz: { parameter: DateOrString, return: Date },
  interval: { parameter: DateOrString, return: String },

  // Network address types
  inet: { parameter: String, return: String },
  cidr: { parameter: String, return: String },
  macaddr: { parameter: String, return: String },
  macaddr8: { parameter: String, return: String },

  // Extra types
  money: { parameter: String, return: String },
  tsvector: { parameter: String, return: String },
  void: { parameter: Void, return: Void },

  // JSON types
  json: { parameter: Json, return: Json },
  jsonb: { parameter: Json, return: Json },

  // Bytes
  bytea: { parameter: Bytes, return: Bytes },

  // Postgis types
  point: { parameter: getArray(Number), return: getArray(Number) },
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
        DefaultTypeMapping[typeName as BuiltinTypes].parameter,
      return:
        overrides[typeName]?.return ??
        DefaultTypeMapping[typeName as BuiltinTypes].return,
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
    if (os.platform() === "win32") {
      // make sure we use posix separators in TS import declarations (see #533)
      from = from.split(path.sep).join(path.posix.sep);
    }

    if (!from.startsWith('.')) {
      from = './' + from;
    }
  }

  const lines = [];

  if (defaultImportAlias) {
    const defaultImportDec = `import type ${defaultImportAlias} from '${from}';`;
    if (names.size > 0) {
      // A type-only import can specify a default import or named bindings, but not both.
      lines.push(defaultImportDec);
    } else {
      return `${defaultImportDec}\n`
    }
  }

  // Handle named bindings

  const parts = ['import'];

  if (from !== '@pgtyped/runtime') {
    parts.push('type');
  }

  const subParts = [];

  if (names.size) {
    subParts.push(
      `{ ${[...names.entries()]
        .map(([name, alias]) => (name === alias ? name : `${name} as ${alias}`))
        .join(', ')} }`,
    );
  }

  parts.push(subParts.join(', '));
  parts.push(`from '${from}';\n`);

  lines.push(parts.join(' '));

  return lines.join('\n');
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

export enum TypeScope {
  Parameter = 'parameter',
  Return = 'return',
}

type importsType = { [k: string]: ImportedType[] };

export type TypeDefinitions = {
  imports: importsType;
  enums: EnumType[];
  aliases: AliasedType[];
};

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
  use(typeNameOrType: MappableType, scope: TypeScope): string {
    let typ: Type | null = null;

    if (typeof typeNameOrType == 'string') {
      if (typeNameOrType[0] === '_') {
        // If starts with _ it is an PG Array type

        const arrayValueType = typeNameOrType.slice(1);
        // ^ Converts _varchar -> varchar, then wraps the type in an array

        const mappedType = this.use(arrayValueType, scope);
        typ = getArray({ name: mappedType });
      } else {
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
        if (this.mapping[typeNameOrType.elementType.name]?.[scope]) {
          typ = getArray({
            name: typeNameOrType.elementType.name,
            definition:
              this.mapping[typeNameOrType.elementType.name][scope].name,
          });
        } else {
          typ = getArray(typeNameOrType.elementType);
        }
        // make sure the element type is used so it appears in the declaration
        this.use(typeNameOrType.elementType, scope);
      } else {
        typ = this.mapping[typeNameOrType.name]?.[scope] ?? typeNameOrType;
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

  // In order to get the results out of the Piscina pool, we need to have
  //  a serializable variant
  public toTypeDefinitions(): TypeDefinitions {
    return {
      imports: this.imports,
      enums: Object.values(this.types).filter(isEnum),
      aliases: Object.values(this.types).filter(isAlias),
    };
  }

  // Static so we can also use this for serialized typeDefinitions
  public static typeDefinitionDeclarations(
    decsFileName: string,
    types: TypeDefinitions,
  ): string {
    return [
      Object.values(types.imports)
        .map((i) => declareImport(i, decsFileName))
        .join('\n'),
      types.enums
        .map((t) => declareStringUnion(t.name, t.enumValues))
        .sort()
        .join('\n'),
      types.aliases
        .map((t) => declareAlias(t.name, t.definition))
        .sort()
        .join('\n'),
    ]
      .filter((s) => s)
      .join('\n');
  }

  /** Emit a typescript definition for all types that have been used */
  declaration(decsFileName: string): string {
    return TypeAllocator.typeDefinitionDeclarations(
      decsFileName,
      this.toTypeDefinitions(),
    );
  }
}
