// Generated from src/loader/pg-promise/grammar/QueryParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor.js";

import { InputContext } from "./QueryParser.js";
import { QueryContext } from "./QueryParser.js";
import { ParamContext } from "./QueryParser.js";
import { IgnoredContext } from "./QueryParser.js";
import { ParamNamedContext } from "./QueryParser.js";
import { ParamIndexedContext } from "./QueryParser.js";
import { FormatterContext } from "./QueryParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `QueryParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface QueryParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `QueryParser.input`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInput?: (ctx: InputContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.query`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuery?: (ctx: QueryContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.param`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParam?: (ctx: ParamContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.ignored`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIgnored?: (ctx: IgnoredContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.paramNamed`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParamNamed?: (ctx: ParamNamedContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.paramIndexed`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParamIndexed?: (ctx: ParamIndexedContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.formatter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormatter?: (ctx: FormatterContext) => Result;
}

