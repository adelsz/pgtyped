import { SQLQueryIR } from '@pgtyped/parser';
import { InterpolatedQuery, QueryParameters } from './preprocessor.js';
export declare const processSQLQueryIR: (queryIR: SQLQueryIR, passedParams?: QueryParameters) => InterpolatedQuery;
