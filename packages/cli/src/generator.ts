export enum FieldType {
  String = 'string',
  Number = 'number'
}

export interface IField {
  fieldName: string;
  fieldType: FieldType;
  nullable: boolean;
}

export const reindent = (
  str: string,
  level: number,
) => str.replace(
  /^\s*/gm,
  '  '.repeat(level)
);

const interfaceGen = (interfaceName: string, contents: string) =>
  `export interface ${interfaceName} {
${reindent(contents, 1)}
}`;

export const generateInterface = (
  interfaceName: string,
  fields: Array<IField>,
) => {
  const contents = fields
    .map(({
      fieldName, fieldType, nullable,
    }) => `${fieldName}: ${fieldType}${nullable ? ' | null' : ''};`)
    .join('\n');
  return interfaceGen(interfaceName, contents);
};