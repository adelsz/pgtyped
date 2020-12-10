import nun from 'nunjucks';
import path from 'path';
import fs from 'fs';
import JestWorker from 'jest-worker';
import { promisify } from 'util';
import { generateDeclarationFile } from './generator';
import { AsyncQueue, startup } from '@pgtyped/query';
import { ParsedConfig, TransformConfig } from './config';

const writeFile = promisify(fs.writeFile);

const connection = new AsyncQueue();
let config: ParsedConfig;

export async function setup(c: ParsedConfig) {
  config = c;
  await startup(config.db, connection);
}

export async function processFile(
  fileName: string,
  transform: TransformConfig,
): Promise<
  | {
      typeDecsLength: number;
      relativePath: string;
    }
  | undefined
> {
  const ppath = path.parse(fileName);
  let decsFileName;
  if (transform.emitTemplate) {
    decsFileName = nun.renderString(transform.emitTemplate, ppath);
  } else {
    const suffix = transform.mode === 'ts' ? 'types.ts' : 'ts';
    decsFileName = path.resolve(ppath.dir, `${ppath.name}.${suffix}`);
  }
  const contents = fs.readFileSync(fileName).toString();
  const { declarationFileContents, typeDecs } = await generateDeclarationFile(
    contents,
    fileName,
    connection,
    transform.mode,
    void 0,
    config,
  );
  if (typeDecs.length > 0) {
    await writeFile(decsFileName, declarationFileContents);
    return {
      typeDecsLength: typeDecs.length,
      relativePath: path.relative(process.cwd(), decsFileName),
    };
  }
}

export interface WorkerInterface extends JestWorker {
  processFile: typeof processFile;
}
