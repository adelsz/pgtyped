import { startup } from '@pgtyped/query';
import { AsyncQueue } from '@pgtyped/wire';
import fs from 'fs-extra';
import nun from 'nunjucks';
import path from 'path';
import { ParsedConfig, TransformConfig } from './config.js';
import {
  generateDeclarationFile,
  generateTypedecsFromFile,
} from './generator.js';
import { TypeAllocator, TypeMapping, TypeScope } from './types.js';
import { getProgram } from './tsProgram.js';

// disable autoescape as it breaks windows paths
// see https://github.com/adelsz/pgtyped/issues/519 for details
nun.configure({ autoescape: false });

let connected = false;
const connection = new AsyncQueue();

interface ExtendedParsedPath extends path.ParsedPath {
  dir_base: string;
}

export type IWorkerResult =
  | {
      skipped: boolean;
      typeDecsLength: number;
      relativePath: string;
    }
  | {
      error: any;
      relativePath: string;
    };

async function connectAndGetFileContents(
  fileName: string,
  config: ParsedConfig,
) {
  if (!connected) {
    await startup(config.db, connection);
    connected = true;
  }

  // last part fixes https://github.com/adelsz/pgtyped/issues/390
  return fs.readFileSync(fileName).toString().replace(/\r\n/g, '\n');
}

export async function getTypeDecs({
  fileName,
  transform,
  config,
  isInitial,
}: {
  fileName: string;
  transform: TransformConfig;
  config: ParsedConfig;
  isInitial: boolean;
}) {
  const contents = await connectAndGetFileContents(fileName, config);
  const types = new TypeAllocator(TypeMapping(config.typesOverrides));

  if (transform.mode === 'sql') {
    // Second parameter has no effect here, we could have used any value
    types.use(
      { name: 'PreparedQuery', from: '@pgtyped/runtime' },
      TypeScope.Return,
      config.enums?.style === 'enum' ? config.enums : undefined,
    );
  }
  const programGetter =
    transform.mode === 'ts-pg-promise'
      ? () => getProgram(transform, !isInitial)
      : undefined;

  return await generateTypedecsFromFile(
    contents,
    fileName,
    connection,
    transform,
    types,
    config,
    programGetter,
  );
}

export type getTypeDecsFnResult = ReturnType<typeof getTypeDecs>;

export async function processFile({
  fileName,
  transform,
  config,
}: {
  fileName: string;
  transform: TransformConfig;
  config: ParsedConfig;
}): Promise<IWorkerResult> {
  const ppath = path.parse(fileName) as ExtendedParsedPath;
  ppath.dir_base = path.basename(ppath.dir);
  let decsFileName;
  if ('emitTemplate' in transform && transform.emitTemplate) {
    decsFileName = nun.renderString(transform.emitTemplate, ppath);
  } else {
    const suffix = transform.mode === 'ts' ? 'types.ts' : 'ts';
    decsFileName = path.resolve(ppath.dir, `${ppath.name}.${suffix}`);
  }

  let typeDecSet;
  try {
    typeDecSet = await getTypeDecs({
      fileName,
      transform,
      config,
      isInitial: true,
    });
  } catch (e) {
    return {
      error: e,
      relativePath: path.relative(process.cwd(), fileName),
    };
  }
  const relativePath = path.relative(process.cwd(), decsFileName);

  if (typeDecSet.typedQueries.length > 0) {
    const declarationFileContents = generateDeclarationFile(typeDecSet, config);
    const oldDeclarationFileContents = (await fs.pathExists(decsFileName))
      ? await fs.readFile(decsFileName, { encoding: 'utf-8' })
      : null;
    if (oldDeclarationFileContents !== declarationFileContents) {
      await fs.outputFile(decsFileName, declarationFileContents);
      return {
        skipped: false,
        typeDecsLength: typeDecSet.typedQueries.length,
        relativePath,
      };
    }
  }
  return {
    skipped: true,
    typeDecsLength: 0,
    relativePath,
  };
}

export type processFileFnResult = ReturnType<typeof processFile>;
