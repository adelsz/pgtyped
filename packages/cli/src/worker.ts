import nun from 'nunjucks';
import path from 'path';
import fs from 'fs-extra';
import { generateDeclarationFile } from './generator.js';
import { startup } from '@pgtyped/query';
import { ParsedConfig, TransformConfig } from './config.js';
import { AsyncQueue } from '@pgtyped/wire';
import worker from 'piscina';

let connected = false;
const connection = new AsyncQueue();
const config: ParsedConfig = worker.workerData;

export default async function processFile({
  fileName,
  transform,
}: {
  fileName: string;
  transform: TransformConfig;
}): Promise<{
  skipped: boolean;
  typeDecsLength: number;
  relativePath: string;
}> {
  if (!connected) {
    await startup(config.db, connection);
    connected = true;
  }
  const ppath = path.parse(fileName);
  let decsFileName;
  if (transform.emitTemplate) {
    decsFileName = nun.renderString(transform.emitTemplate, ppath);
  } else {
    const suffix = transform.mode === 'ts' ? 'types.ts' : 'ts';
    decsFileName = path.resolve(ppath.dir, `${ppath.name}.${suffix}`);
  }

  // last part fixes https://github.com/adelsz/pgtyped/issues/390
  const contents = fs.readFileSync(fileName).toString().replace(/\r\n/g, '\n');

  const { declarationFileContents, typeDecs } = await generateDeclarationFile(
    contents,
    fileName,
    connection,
    transform.mode,
    config,
  );
  const relativePath = path.relative(process.cwd(), decsFileName);
  if (typeDecs.length > 0) {
    const oldDeclarationFileContents = (await fs.pathExists(decsFileName))
      ? await fs.readFile(decsFileName, { encoding: 'utf-8' })
      : null;
    if (oldDeclarationFileContents !== declarationFileContents) {
      await fs.outputFile(decsFileName, declarationFileContents);
      return {
        skipped: false,
        typeDecsLength: typeDecs.length,
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
