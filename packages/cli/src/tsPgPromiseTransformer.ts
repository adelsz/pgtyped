import chokidar from 'chokidar';
import fs from 'fs-extra';
import { globSync } from 'glob';
import path from 'path';
import { ParsedConfig, TSPgPromiseTransformConfig } from './config.js';
import {
  generateDeclarations,
  TSTypedQuery,
  TypeDeclarationSet,
  TypePairGeneration,
} from './generator.js';
import { WorkerPool } from './index.js';
import { TypeAllocator } from './types.js';
import { debug } from './util.js';
import { getTypeDecs } from './worker.js';
import ts from 'typescript';
import {
  MethodReturnMultiplicity,
  TSQueryASTWithTypeInfo,
} from './parseTsPgPromise.js';

type TypedSQLTagTransformResult = TypeDeclarationSet | undefined;

function getQueryReturnType(typeDec: TSTypedQuery<TSQueryASTWithTypeInfo>) {
  const typeReferenceNode = ts.factory.createTypeReferenceNode(
    `${typeDec.typeDeclaration.queryName}Result`,
  );
  switch (typeDec.query.ast.methodReturnMultiplicity) {
    case MethodReturnMultiplicity.None:
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);
    case MethodReturnMultiplicity.One:
      return typeReferenceNode;
    case MethodReturnMultiplicity.Many:
      return ts.factory.createArrayTypeNode(typeReferenceNode);
    case MethodReturnMultiplicity.OneOrNone:
      return ts.factory.createUnionTypeNode([
        typeReferenceNode,
        ts.factory.createLiteralTypeNode(ts.factory.createNull()),
      ]);
    case MethodReturnMultiplicity.ManyOrNone:
      return ts.factory.createArrayTypeNode(typeReferenceNode);
  }
  return typeReferenceNode;
}

function totalStringArrayLength(arr: string[]) {
  return arr.reduce((acc, str) => acc + str.length, 0);
}

function generateMethodSignatures(
  typedQueries: TSTypedQuery<TSQueryASTWithTypeInfo>[],
  maxUnionStringTotalLength: number,
) {
  return typedQueries
    .filter(
      (typeDec) =>
        typeof typeDec.query.ast.type === 'string' ||
        totalStringArrayLength(typeDec.query.ast.type) <=
          maxUnionStringTotalLength,
    )
    .map((typeDec) =>
      ts.factory.createMethodSignature(
        undefined,
        typeDec.query.ast.methodName,
        undefined,
        undefined,
        [
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            's',
            undefined,
            typeof typeDec.query.ast.type === 'string'
              ? stringToStringLiteralTypeNode(typeDec.query.ast.type)
              : stringArrayToUnionTypeNode(typeDec.query.ast.type),
          ),
          ...(typeDec.query.ast.params.length > 0
            ? [
                ts.factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  'params',
                  undefined,
                  ts.factory.createTypeReferenceNode(
                    `${typeDec.typeDeclaration.queryName}Params`,
                  ),
                ),
              ]
            : []),
        ],
        ts.factory.createTypeReferenceNode('Promise', [
          getQueryReturnType(typeDec),
        ]),
      ),
    );
}

function stringToStringLiteralTypeNode(str: string) {
  return ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(str));
}

function stringArrayToUnionTypeNode(arr: string[]) {
  return ts.factory.createUnionTypeNode(
    arr.map((str) => stringToStringLiteralTypeNode(str)),
  );
}

type RunOpts = RunOptsInitial | RunOptsIncremental;

interface Job {
  files: string[];
  runOpts: RunOpts;
}

interface RunOptsInitial {
  isInitial: true;
  abortController: undefined;
  isWatchMode: boolean;
}

interface RunOptsIncremental {
  isInitial: false;
  abortController: AbortController;
  isWatchMode: true;
}

function createFallbackMethodSignature(name: string) {
  return ts.factory.createMethodSignature(
    undefined,
    name,
    undefined,
    undefined,
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        's',
        undefined,
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        'params',
        undefined,
        stringToStringLiteralTypeNode(
          'Fallback error: check parameter names and nullabilities (by default they are not null)',
        ),
      ),
    ],
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
  );
}

// tslint:disable:no-console
export class TsPgPromiseTransformer {
  private currentJob: Job | undefined;
  private readonly cache: Record<string, TypeDeclarationSet> = {};
  private readonly includePattern: string;
  private readonly localFileName: string;
  private readonly fullFileName: string;

  constructor(
    private readonly pool: WorkerPool,
    private readonly config: ParsedConfig,
    private readonly transform: TSPgPromiseTransformConfig,
  ) {
    this.includePattern = `${this.config.srcDir}/**/${transform.include}`;
    this.localFileName = this.transform.emitFileName;
    this.fullFileName = path.relative(process.cwd(), this.localFileName);
  }

  private async watch() {
    let initialized = false;
    const initialWatchJob: Job = {
      files: [],
      runOpts: {
        isInitial: true,
        abortController: undefined,
        isWatchMode: true,
      },
    };
    const cb = async (fileName: string) => {
      if (!initialized) {
        initialWatchJob.files.push(fileName);
      } else {
        await this.generateTypedSQLTagFileForJob([fileName], {
          isInitial: false,
          abortController: new AbortController(),
          isWatchMode: true,
        });
      }
    };
    chokidar
      .watch(this.includePattern, {
        persistent: true,
        ignored: this.getIgnoredFiles(),
      })
      .on('add', cb)
      .on('change', (file) => {
        if (!initialized) {
          console.log(
            `Initial load still in progress, ignoring change of ${file}`,
          );
          return;
        }
        cb(file);
      })
      .on('unlink', async (file) => await this.removeFileFromCache(file))
      .on('ready', async () => {
        initialized = true;
        await this.waitForTypedSQLQueueAndGenerate(initialWatchJob);
      });
  }

  private getIgnoredFiles() {
    const ignored = [this.localFileName];
    if (this.transform.exclude) {
      ignored.push(this.transform.exclude);
    }
    return ignored;
  }

  public async start(watch: boolean) {
    if (watch) {
      return this.watch();
    }

    const fileList = globSync(this.includePattern, {
      ignore: this.getIgnoredFiles(),
    });

    debug('found query files %o', fileList);

    await this.generateTypedSQLTagFileForJob(fileList, {
      isInitial: true,
      abortController: undefined,
      isWatchMode: false,
    });
  }

  private async getTsTypeDecs(
    fileName: string,
    isInitial: boolean,
    signal: AbortSignal | undefined,
  ): Promise<TypedSQLTagTransformResult> {
    try {
      return await this.pool.run(
        {
          fileName,
          transform: this.transform,
          config: this.config,
          isInitial,
        } satisfies Parameters<typeof getTypeDecs>[0],
        'getTypeDecs',
        signal,
      );
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        console.error(`Error processing ${fileName}: ${e}`);
        console.error((e as Error).stack);
      }
      return undefined;
    }
  }

  private async generateTypedSQLTagFileForJob(
    files: string[],
    runOpts: RunOpts,
  ) {
    const job: Job = {
      files,
      runOpts,
    };
    return this.waitForTypedSQLQueueAndGenerate(job);
  }

  private async waitForTypedSQLQueueAndGenerate(job: Job) {
    let isRestart = false;
    if (this.currentJob) {
      if (this.currentJob.runOpts.isInitial) {
        console.log(`Initial load still in progress, ignoring change`);
        return;
      } else if (
        this.currentJob.files.length === 1 &&
        job.files.length === 1 &&
        this.currentJob.files[0] === job.files[0]
      ) {
        isRestart = true;
        this.currentJob.runOpts.abortController.abort();
        this.currentJob = undefined;
      }
    }
    if (!isRestart) {
      console.log(`Processing ${job.files.length} files...`);
    }
    this.currentJob = job;
    const queueResults = await Promise.all(
      job.files.map((fileName) =>
        this.getTsTypeDecs(
          fileName,
          job.runOpts.isInitial,
          job.runOpts.abortController?.signal,
        ),
      ),
    );

    const hasSuccessfulJobs = queueResults.some(
      (result) => result !== undefined,
    );
    if (!hasSuccessfulJobs) {
      return;
    }

    const typeDecsSets: TypeDeclarationSet[] = [];

    const useCache = job.runOpts.isWatchMode;
    for (const result of queueResults) {
      if (result?.typedQueries.length) {
        typeDecsSets.push(result);
        if (useCache) this.cache[result.fileName] = result;
      }
    }

    await this.generateTypedSQLTagFile(
      useCache ? Object.values(this.cache) : typeDecsSets,
    );
    this.currentJob = undefined;
  }

  private async removeFileFromCache(fileToRemove: string) {
    delete this.cache[fileToRemove];
    return this.generateTypedSQLTagFile(Object.values(this.cache));
  }

  private async generateTypedSQLTagFile(typeDecsSets: TypeDeclarationSet[]) {
    const typeDefinitions = TypeAllocator.typeDefinitionDeclarations(
      this.transform.emitFileName,
      {
        imports: typeDecsSets.reduce(
          (acc, typeDecSet) => ({
            ...acc,
            ...typeDecSet.typeDefinitions.imports,
          }),
          {},
        ),
        aliases: uniqBy(
          typeDecsSets.flatMap(
            (typeDecSet) => typeDecSet.typeDefinitions.aliases,
          ),
          (t) => t.name,
        ).sort((a, b) => a.name.localeCompare(b.name)),
        enums: uniqBy(
          typeDecsSets.flatMap(
            (typeDecSet) => typeDecSet.typeDefinitions.enums,
          ),
          (t) => t.name,
        ).sort((a, b) => a.name.localeCompare(b.name)),
      },
      this.config.enums,
    );

    const allQueries = typeDecsSets
      .flatMap(
        (typeDecSet) =>
          typeDecSet.typedQueries as TSTypedQuery<TSQueryASTWithTypeInfo>[],
      )
      .sort(querySortFn);

    const nameCounts = new Map<string, number>();
    for (const query of allQueries) {
      const name = query.typeDeclaration.queryName;
      const count = nameCounts.get(name) ?? 0;
      nameCounts.set(name, count + 1);
    }

    const renamed = new Map<string, number>();

    const allQueriesUniqueNames = allQueries.map((typeDec) => {
      const nameCount = nameCounts.get(typeDec.typeDeclaration.queryName)!;
      let num;
      if (nameCount > 1) {
        num = renamed.get(typeDec.typeDeclaration.queryName) ?? 1;
        renamed.set(typeDec.typeDeclaration.queryName, num + 1);
      }
      return {
        ...typeDec,
        typeDeclaration: {
          ...typeDec.typeDeclaration,
          queryName: num
            ? `${typeDec.typeDeclaration.queryName}${num}`
            : typeDec.typeDeclaration.queryName,
        },
      };
    });

    const queryTypes = generateDeclarations(
      allQueriesUniqueNames,
      this.config,
      TypePairGeneration.Skip,
    );
    const txInterface = ts.factory.createInterfaceDeclaration(
      ts.factory.createModifiersFromModifierFlags(ts.ModifierFlags.Export),
      this.transform.interfaceName,
      undefined,
      undefined,
      [
        ...generateMethodSignatures(
          allQueriesUniqueNames as TSTypedQuery<TSQueryASTWithTypeInfo>[],
          this.transform.maxMethodParameterUnionTypeLength ?? 10000,
        ),
        // fallback signatures aren't strictly necessary, but they make error messages a little less bad
        // (but still not great) when the 2nd parameter type does not match.
        ...['none', 'oneOrNone', 'one', 'manyOrNone', 'many'].map((name) =>
          createFallbackMethodSignature(name),
        ),
      ],
    );
    const file = ts.factory.createSourceFile(
      [txInterface],
      ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None,
    );

    const printer = ts.createPrinter(
      { newLine: ts.NewLineKind.LineFeed },
      {
        // this substition avoids very long lines in the output, making it easier for text editors etc. to handle
        substituteNode: (_, node) =>
          ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)
            ? ts.factory.createNoSubstitutionTemplateLiteral(
                undefined,
                node.literal.text,
              )
            : node,
      },
    );
    let content = '';
    content += typeDefinitions + '\n';
    content += queryTypes;
    content += printer.printFile(file);
    await fs.outputFile(this.fullFileName, content);
    console.log(`Saved ${this.fullFileName}`);
  }
}

function uniqBy<T>(arr: T[], keyFn: (e: T) => string | number) {
  const seen = new Set();
  return arr.filter((item) => {
    const k = keyFn(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

function querySortFn(
  a: TSTypedQuery<TSQueryASTWithTypeInfo>,
  b: TSTypedQuery<TSQueryASTWithTypeInfo>,
) {
  const nameComp = a.typeDeclaration.queryName.localeCompare(
    b.typeDeclaration.queryName,
  );
  if (nameComp !== 0) {
    return nameComp;
  }
  return a.query.ast.text.localeCompare(b.query.ast.text);
}
