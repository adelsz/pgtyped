var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chokidar from 'chokidar';
import { globSync } from 'glob';
import path from 'path';
import { debug } from './util.js';
import { minimatch } from 'minimatch';
// tslint:disable:no-console
export class TypescriptAndSqlTransformer {
    constructor(pool, config, transform) {
        this.pool = pool;
        this.config = config;
        this.transform = transform;
        this.workQueue = [];
        this.fileOverrideUsed = false;
        this.includePattern = `${this.config.srcDir}/**/${transform.include}`;
    }
    watch() {
        return __awaiter(this, void 0, void 0, function* () {
            const cb = (fileName) => __awaiter(this, void 0, void 0, function* () {
                // we will not push it to the queue to not consume more memory
                return this.processFile(fileName);
            });
            chokidar
                .watch(this.config.srcDir, {
                persistent: true,
                ignored: (fileName, stats) => !!(stats === null || stats === void 0 ? void 0 : stats.isFile()) && !minimatch(fileName, this.transform.include),
            })
                .on('add', cb)
                .on('change', cb);
        });
    }
    start(watch, fileOverride) {
        return __awaiter(this, void 0, void 0, function* () {
            if (watch) {
                return this.watch();
            }
            /**
             * If the user didn't provide the -f paramter, we're using the list of files we got from glob.
             * If he did, we're using glob file list to detect if his provided file should be used with this transform.
             */
            let fileList = globSync(this.includePattern, Object.assign({}, (this.transform.emitFileName && {
                ignore: [`${this.config.srcDir}${this.transform.emitFileName}`],
            })));
            if (fileOverride) {
                fileList = fileList.includes(fileOverride) ? [fileOverride] : [];
                if (fileList.length > 0) {
                    this.fileOverrideUsed = true;
                }
            }
            debug('found query files %o', fileList);
            this.pushToQueue({
                files: fileList,
            });
            yield Promise.all(this.workQueue);
            return this.fileOverrideUsed;
        });
    }
    processFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            fileName = path.relative(process.cwd(), fileName);
            console.log(`Processing ${fileName}`);
            const result = (yield this.pool.run({
                fileName,
                transform: this.transform,
            }, 'processFile'));
            if ('skipped' in result && result.skipped) {
                console.log(`Skipped ${fileName}: no changes or no queries detected`);
            }
            else if ('error' in result) {
                console.error(`Error processing ${fileName}: ${result.error.message}\n${result.error.stack}`);
            }
            else {
                console.log(`Saved ${result.typeDecsLength} query types from ${fileName} to ${result.relativePath}`);
            }
        });
    }
    pushToQueue(job) {
        this.workQueue.push(...job.files.map((fileName) => this.processFile(fileName)));
    }
}
//# sourceMappingURL=typescriptAndSqlTransformer.js.map