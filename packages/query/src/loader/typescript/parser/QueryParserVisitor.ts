// Generated from src/loader/typescript/grammar/QueryParser.g4 by ANTLR 4.7.3-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { InputContext } from "./QueryParser";
import { QueryContext } from "./QueryParser";
import { IgnoredContext } from "./QueryParser";
import { ParamContext } from "./QueryParser";
import { ScalarParamContext } from "./QueryParser";
import { PickParamContext } from "./QueryParser";
import { ArrayPickParamContext } from "./QueryParser";
import { ArrayParamContext } from "./QueryParser";
import { ParamNameContext } from "./QueryParser";
import { PickKeyContext } from "./QueryParser";


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
	 * Visit a parse tree produced by `QueryParser.ignored`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIgnored?: (ctx: IgnoredContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.param`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParam?: (ctx: ParamContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.scalarParam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitScalarParam?: (ctx: ScalarParamContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.pickParam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPickParam?: (ctx: PickParamContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.arrayPickParam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayPickParam?: (ctx: ArrayPickParamContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.arrayParam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayParam?: (ctx: ArrayParamContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.paramName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParamName?: (ctx: ParamNameContext) => Result;

	/**
	 * Visit a parse tree produced by `QueryParser.pickKey`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPickKey?: (ctx: PickKeyContext) => Result;
}

