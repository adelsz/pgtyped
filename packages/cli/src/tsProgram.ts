import ts from 'typescript';
import { TSPgPromiseTransformConfig } from './config.js';
import path from 'path';

let program: ts.Program | undefined;

function createProgram(
  transform: TSPgPromiseTransformConfig,
  oldProgram: ts.Program | undefined,
) {
  const { config } = ts.readConfigFile(transform.tsconfigPath, ts.sys.readFile);
  const tsConfig = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    path.dirname(transform.tsconfigPath),
  );
  return ts.createProgram(
    tsConfig.fileNames,
    tsConfig.options,
    undefined,
    oldProgram,
  );
}

export function getProgram(
  transform: TSPgPromiseTransformConfig,
  reCreate: boolean,
) {
  if (program && !reCreate) {
    return program;
  }
  program = createProgram(transform, program);
  return program;
}
