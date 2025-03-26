import { TSQueryAST } from '@pgtyped/parser';
import { InterpolatedQuery, QueryParameters } from './preprocessor.js';
export declare const processTSQueryAST: (query: TSQueryAST, parameters?: QueryParameters) => InterpolatedQuery;
