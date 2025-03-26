import { ImportedType, MappableType, Type } from '@pgtyped/query';
import { AliasedType, EnumType } from '@pgtyped/query/lib/type.js';
export declare const DefaultTypeMapping: Readonly<{
    int2: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    int4: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    int8: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    smallint: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    int: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    bigint: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    real: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    float4: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    float: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    float8: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    numeric: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    decimal: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    smallserial: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    serial: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    bigserial: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    uuid: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    text: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    varchar: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    char: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    bpchar: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    citext: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    name: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    bit: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    bool: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    boolean: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    date: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    timestamp: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    timestamptz: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    time: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    timetz: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    interval: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    inet: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    cidr: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    macaddr: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    macaddr8: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    money: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    tsvector: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    void: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    json: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
    };
    jsonb: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
        return: import("@pgtyped/query/lib/type.js").NamedType | AliasedType;
    };
    bytea: {
        parameter: import("@pgtyped/query/lib/type.js").NamedType;
        return: import("@pgtyped/query/lib/type.js").NamedType;
    };
    point: {
        parameter: Type;
        return: Type;
    };
}>;
export type BuiltinTypes = keyof typeof DefaultTypeMapping;
export type TypeDefinition = {
    parameter: Type;
    return: Type;
};
export type TypeMapping = Record<BuiltinTypes, TypeDefinition> & Record<string, TypeDefinition>;
export declare function TypeMapping(overrides?: Record<string, Partial<TypeDefinition>>): TypeMapping;
export declare function declareImport(imports: ImportedType[], decsFileName: string): string;
export declare enum TypeScope {
    Parameter = "parameter",
    Return = "return"
}
type importsType = {
    [k: string]: ImportedType[];
};
export type TypeDefinitions = {
    imports: importsType;
    enums: EnumType[];
    aliases: AliasedType[];
};
/** Wraps a TypeMapping to track which types have been used, to accumulate errors,
 * and emit necessary type definitions. */
export declare class TypeAllocator {
    private mapping;
    private allowUnmappedTypes?;
    errors: Error[];
    imports: {
        [k: string]: ImportedType[];
    };
    types: {
        [k: string]: Type;
    };
    constructor(mapping: TypeMapping, allowUnmappedTypes?: boolean | undefined);
    isMappedType(name: string): name is keyof TypeMapping;
    /** Lookup a database-provided type name in the allocator's map */
    use(typeNameOrType: MappableType, scope: TypeScope): string;
    toTypeDefinitions(): TypeDefinitions;
    static typeDefinitionDeclarations(decsFileName: string, types: TypeDefinitions): string;
    /** Emit a typescript definition for all types that have been used */
    declaration(decsFileName: string): string;
}
export {};
