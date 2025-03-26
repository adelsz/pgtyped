export function isImport(typ) {
    return 'from' in typ;
}
export function isAlias(typ) {
    return 'definition' in typ;
}
export function isEnum(typ) {
    return typeof typ !== 'string' && 'enumValues' in typ;
}
export function isEnumArray(typ) {
    return typeof typ !== 'string' && 'elementType' in typ;
}
//# sourceMappingURL=type.js.map