// Generated from src/loader/sql/grammar/SQLParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener.js";

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
 * This interface defines a complete listener for a parse tree produced by
 * `SQLParser`.
 */
export interface SQLParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `SQLParser.input`.
	 * @param ctx the parse tree
	 */
	enterInput?: (ctx: InputContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.input`.
	 * @param ctx the parse tree
	 */
	exitInput?: (ctx: InputContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.query`.
	 * @param ctx the parse tree
	 */
	enterQuery?: (ctx: QueryContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.query`.
	 * @param ctx the parse tree
	 */
	exitQuery?: (ctx: QueryContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.queryDef`.
	 * @param ctx the parse tree
	 */
	enterQueryDef?: (ctx: QueryDefContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.queryDef`.
	 * @param ctx the parse tree
	 */
	exitQueryDef?: (ctx: QueryDefContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.ignoredComment`.
	 * @param ctx the parse tree
	 */
	enterIgnoredComment?: (ctx: IgnoredCommentContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.ignoredComment`.
	 * @param ctx the parse tree
	 */
	exitIgnoredComment?: (ctx: IgnoredCommentContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.statementBody`.
	 * @param ctx the parse tree
	 */
	enterStatementBody?: (ctx: StatementBodyContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.statementBody`.
	 * @param ctx the parse tree
	 */
	exitStatementBody?: (ctx: StatementBodyContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.word`.
	 * @param ctx the parse tree
	 */
	enterWord?: (ctx: WordContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.word`.
	 * @param ctx the parse tree
	 */
	exitWord?: (ctx: WordContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.range`.
	 * @param ctx the parse tree
	 */
	enterRange?: (ctx: RangeContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.range`.
	 * @param ctx the parse tree
	 */
	exitRange?: (ctx: RangeContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.param`.
	 * @param ctx the parse tree
	 */
	enterParam?: (ctx: ParamContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.param`.
	 * @param ctx the parse tree
	 */
	exitParam?: (ctx: ParamContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.paramId`.
	 * @param ctx the parse tree
	 */
	enterParamId?: (ctx: ParamIdContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.paramId`.
	 * @param ctx the parse tree
	 */
	exitParamId?: (ctx: ParamIdContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.nameTag`.
	 * @param ctx the parse tree
	 */
	enterNameTag?: (ctx: NameTagContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.nameTag`.
	 * @param ctx the parse tree
	 */
	exitNameTag?: (ctx: NameTagContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.paramTag`.
	 * @param ctx the parse tree
	 */
	enterParamTag?: (ctx: ParamTagContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.paramTag`.
	 * @param ctx the parse tree
	 */
	exitParamTag?: (ctx: ParamTagContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.paramTransform`.
	 * @param ctx the parse tree
	 */
	enterParamTransform?: (ctx: ParamTransformContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.paramTransform`.
	 * @param ctx the parse tree
	 */
	exitParamTransform?: (ctx: ParamTransformContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.transformRule`.
	 * @param ctx the parse tree
	 */
	enterTransformRule?: (ctx: TransformRuleContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.transformRule`.
	 * @param ctx the parse tree
	 */
	exitTransformRule?: (ctx: TransformRuleContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.spreadTransform`.
	 * @param ctx the parse tree
	 */
	enterSpreadTransform?: (ctx: SpreadTransformContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.spreadTransform`.
	 * @param ctx the parse tree
	 */
	exitSpreadTransform?: (ctx: SpreadTransformContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.pickTransform`.
	 * @param ctx the parse tree
	 */
	enterPickTransform?: (ctx: PickTransformContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.pickTransform`.
	 * @param ctx the parse tree
	 */
	exitPickTransform?: (ctx: PickTransformContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.spreadPickTransform`.
	 * @param ctx the parse tree
	 */
	enterSpreadPickTransform?: (ctx: SpreadPickTransformContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.spreadPickTransform`.
	 * @param ctx the parse tree
	 */
	exitSpreadPickTransform?: (ctx: SpreadPickTransformContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.key`.
	 * @param ctx the parse tree
	 */
	enterKey?: (ctx: KeyContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.key`.
	 * @param ctx the parse tree
	 */
	exitKey?: (ctx: KeyContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.queryName`.
	 * @param ctx the parse tree
	 */
	enterQueryName?: (ctx: QueryNameContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.queryName`.
	 * @param ctx the parse tree
	 */
	exitQueryName?: (ctx: QueryNameContext) => void;

	/**
	 * Enter a parse tree produced by `SQLParser.paramName`.
	 * @param ctx the parse tree
	 */
	enterParamName?: (ctx: ParamNameContext) => void;
	/**
	 * Exit a parse tree produced by `SQLParser.paramName`.
	 * @param ctx the parse tree
	 */
	exitParamName?: (ctx: ParamNameContext) => void;
}

