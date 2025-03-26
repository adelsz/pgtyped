var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { startup } from '@pgtyped/query';
import { AsyncQueue } from '@pgtyped/wire';
import fs from 'fs-extra';
import nun from 'nunjucks';
import path from 'path';
import worker from 'piscina';
import { generateDeclarationFile, generateTypedecsFromFile, } from './generator.js';
import { TypeAllocator, TypeMapping, TypeScope } from './types.js';
// disable autoescape as it breaks windows paths
// see https://github.com/adelsz/pgtyped/issues/519 for details
nun.configure({ autoescape: false });
let connected = false;
const connection = new AsyncQueue();
const config = worker.workerData;
function connectAndGetFileContents(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!connected) {
            yield startup(config.db, connection);
            connected = true;
        }
        // last part fixes https://github.com/adelsz/pgtyped/issues/390
        return fs.readFileSync(fileName).toString().replace(/\r\n/g, '\n');
    });
}
export function getTypeDecs({ fileName, transform, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const contents = yield connectAndGetFileContents(fileName);
        const types = new TypeAllocator(TypeMapping(config.typesOverrides));
        if (transform.mode === 'sql') {
            // Second parameter has no effect here, we could have used any value
            types.use({ name: 'PreparedQuery', from: '@pgtyped/runtime' }, TypeScope.Return);
        }
        return yield generateTypedecsFromFile(contents, fileName, connection, transform, types, config);
    });
}
export function processFile({ fileName, transform, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const ppath = path.parse(fileName);
        ppath.dir_base = path.basename(ppath.dir);
        let decsFileName;
        if ('emitTemplate' in transform && transform.emitTemplate) {
            decsFileName = nun.renderString(transform.emitTemplate, ppath);
        }
        else {
            const suffix = transform.mode === 'ts' ? 'types.ts' : 'ts';
            decsFileName = path.resolve(ppath.dir, `${ppath.name}.${suffix}`);
        }
        let typeDecSet;
        try {
            typeDecSet = yield getTypeDecs({ fileName, transform });
        }
        catch (e) {
            return {
                error: e,
                relativePath: path.relative(process.cwd(), fileName),
            };
        }
        const relativePath = path.relative(process.cwd(), decsFileName);
        if (typeDecSet.typedQueries.length > 0) {
            const declarationFileContents = yield generateDeclarationFile(typeDecSet);
            const oldDeclarationFileContents = (yield fs.pathExists(decsFileName))
                ? yield fs.readFile(decsFileName, { encoding: 'utf-8' })
                : null;
            if (oldDeclarationFileContents !== declarationFileContents) {
                yield fs.outputFile(decsFileName, declarationFileContents);
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
    });
}
//# sourceMappingURL=worker.js.map