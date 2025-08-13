import nun from 'nunjucks';
import fs from 'fs-extra';
import { DbConfig, TransformMode, TypegenConfig } from './config.js';
import { TypeAllocator, TypeMapping, TypeScope } from './types.js';
import { TypeDeclarationSet, generateTypedecsFromFile } from './generator.js';
import { AsyncQueue } from '@pgtyped/wire';
import { startup } from '@pgtyped/query';

nun.configure({ autoescape: false });

export { TypeDeclarationSet, generateDeclarationFile } from './generator.js';
export {
  DbCodec,
  DbConfig,
  TypegenCodec,
  TypegenConfig,
  TransformMode,
} from './config.js';
export {
  generateDeclarations,
  genTypedSQLOverloadFunctions,
  TSTypedQuery,
} from './generator.js';
export { TypeAllocator, TypeDefinition } from './types.js';

export async function getTypes(
  fileName: string,
  {
    connection,
    config = {},
    mode,
  }: {
    connection: DbConfig | AsyncQueue;
    config?: TypegenConfig;
    mode?: TransformMode;
  },
): Promise<TypeDeclarationSet> {
  mode = mode ?? (fileName.endsWith('.ts') ? { mode: 'ts' } : { mode: 'sql' });
  const manageConnection = !(connection instanceof AsyncQueue);

  let queue: AsyncQueue;
  if (manageConnection) {
    queue = new AsyncQueue();
    await startup(connection, queue);
  } else {
    queue = connection;
  }

  // last part fixes https://github.com/adelsz/pgtyped/issues/390
  const contents = fs.readFileSync(fileName).toString().replace(/\r\n/g, '\n');
  const types = new TypeAllocator(TypeMapping(config.typesOverrides));

  if (mode.mode === 'sql') {
    // Second parameter has no effect here, we could have used any value
    types.use(
      { name: 'PreparedQuery', from: '@pgtyped/runtime' },
      TypeScope.Return,
    );
  }

  const result = await generateTypedecsFromFile(
    contents,
    fileName,
    queue,
    types,
    mode,
    config,
  );

  if (manageConnection) {
    queue.socket.end();
  }

  return result;
}

export type getTypeDecsFnResult = ReturnType<typeof getTypes>;
