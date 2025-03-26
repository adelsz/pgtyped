export type Type = NamedType | ImportedType | AliasedType | EnumType | EnumArrayType;
export type MappableType = string | Type;
export interface NamedType {
    name: string;
    definition?: string;
    enumValues?: string[];
}
export interface ImportedType extends NamedType {
    from: string;
    aliasOf?: string;
}
export interface AliasedType extends NamedType {
    definition: string;
}
export interface EnumType extends NamedType {
    enumValues: string[];
}
export interface EnumArrayType extends NamedType {
    name: string;
    elementType: EnumType;
}
export declare function isImport(typ: Type): typ is ImportedType;
export declare function isAlias(typ: Type): typ is AliasedType;
export declare function isEnum(typ: MappableType): typ is EnumType;
export declare function isEnumArray(typ: MappableType): typ is EnumArrayType;
export declare const enum DatabaseTypeKind {
    Base = "b",
    Composite = "c",
    Domain = "d",
    Enum = "e",
    Pseudo = "p",
    Range = "r"
}
