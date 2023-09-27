// Generated from src/loader/sql/grammar/SQLParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor.js";

import {InputContext, RangeContext} from "./SQLParser.js";
import { QueryContext } from "./SQLParser.js";
import { QueryDefContext } from "./SQLParser.js";
import { IgnoredCommentContext } from "./SQLParser.js";
import { StatementContext } from "./SQLParser.js";
import { StatementBodyContext } from "./SQLParser.js";
import { WordContext } from "./SQLParser.js";
import { ParamContext } from "./SQLParser.js";
import { ParamIdContext } from "./SQLParser.js";
import { NameTagContext } from "./SQLParser.js";
import { ParamTagContext } from "./SQLParser.js";
import { ParamTransformContext } from "./SQLParser.js";
import { TransformRuleContext } from "./SQLParser.js";
import { SpreadTransformContext } from "./SQLParser.js";
import { PickTransformContext } from "./SQLParser.js";
import { SpreadPickTransformContext } from "./SQLParser.js";
import { KeyContext } from "./SQLParser.js";
import { QueryNameContext } from "./SQLParser.js";
import { ParamNameContext } from "./SQLParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `SQLParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface SQLParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `SQLParser.input`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInput?: (ctx: InputContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.query`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQuery?: (ctx: QueryContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.queryDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQueryDef?: (ctx: QueryDefContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.ignoredComment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIgnoredComment?: (ctx: IgnoredCommentContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.statementBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatementBody?: (ctx: StatementBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.word`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWord?: (ctx: WordContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.range`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRange?: (ctx: RangeContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.param`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParam?: (ctx: ParamContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.paramId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParamId?: (ctx: ParamIdContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.nameTag`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNameTag?: (ctx: NameTagContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.paramTag`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParamTag?: (ctx: ParamTagContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.paramTransform`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParamTransform?: (ctx: ParamTransformContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.transformRule`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTransformRule?: (ctx: TransformRuleContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.spreadTransform`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSpreadTransform?: (ctx: SpreadTransformContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.pickTransform`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPickTransform?: (ctx: PickTransformContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.spreadPickTransform`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSpreadPickTransform?: (ctx: SpreadPickTransformContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.key`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKey?: (ctx: KeyContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.queryName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQueryName?: (ctx: QueryNameContext) => Result;

	/**
	 * Visit a parse tree produced by `SQLParser.paramName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParamName?: (ctx: ParamNameContext) => Result;
}

