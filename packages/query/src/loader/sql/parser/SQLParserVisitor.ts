// Generated from src/loader/sql/grammar/SQLParser.g4 by ANTLR 4.7.3-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { InputContext } from "./SQLParser";
import { QueryContext } from "./SQLParser";
import { QueryDefContext } from "./SQLParser";
import { IgnoredCommentContext } from "./SQLParser";
import { StatementContext } from "./SQLParser";
import { StatementBodyContext } from "./SQLParser";
import { WordContext } from "./SQLParser";
import { ParamContext } from "./SQLParser";
import { ParamIdContext } from "./SQLParser";
import { NameTagContext } from "./SQLParser";
import { ParamTagContext } from "./SQLParser";
import { ParamTransformContext } from "./SQLParser";
import { TransformRuleContext } from "./SQLParser";
import { SpreadTransformContext } from "./SQLParser";
import { PickTransformContext } from "./SQLParser";
import { SpreadPickTransformContext } from "./SQLParser";
import { KeyContext } from "./SQLParser";
import { QueryNameContext } from "./SQLParser";
import { ParamNameContext } from "./SQLParser";


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

