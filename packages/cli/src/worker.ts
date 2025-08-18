import path from 'path';
import fs from 'fs-extra';
import nun from 'nunjucks';
import worker from 'piscina';
import { AsyncQueue } from '@pgtyped/wire';
import { startup } from '@pgtyped/query';
import {
  getTypes,
  generateDeclarationFile,
  TransformMode,
} from '@pgtyped/typegen';
import { ParsedConfig, TransformConfig } from './config.js';

// disable autoescape as it breaks windows paths
// see https://github.com/adelsz/pgtyped/issues/519 for details
nun.configure({ autoescape: false });

let connected = false;
const connection = new AsyncQueue();
const config: ParsedConfig = worker.workerData;

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

interface ExtendedParsedPath extends path.ParsedPath {
  dir_base: string;
}

export async function processFile({
  fileName,
  transform,
}: {
  fileName: string;
  transform: TransformConfig;
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

  let mode: TransformMode;
  if (transform.mode === 'ts-implicit') {
    mode = { mode: 'ts-implicit', functionName: transform.functionName };
  } else {
    mode = { mode: transform.mode };
  }

  if (!connected) {
    await startup(config.db, connection);
    connected = true;
  }

  let typeDecSet;
  try {
    typeDecSet = await getTypes(fileName, {
      connection,
      config,
      mode,
    });
  } catch (e) {
    return {
      error: e,
      relativePath: path.relative(process.cwd(), fileName),
    };
  }
  const relativePath = path.relative(process.cwd(), decsFileName);

  if (typeDecSet.typedQueries.length > 0) {
    const declarationFileContents = generateDeclarationFile(typeDecSet);
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
