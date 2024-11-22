// Generated from src/loader/pg-promise/grammar/QueryParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener.js";

import { InputContext } from "./QueryParser.js";
import { QueryContext } from "./QueryParser.js";
import { ParamContext } from "./QueryParser.js";
import { IgnoredContext } from "./QueryParser.js";
import { ParamNamedContext } from "./QueryParser.js";
import { ParamIndexedContext } from "./QueryParser.js";
import { FormatterContext } from "./QueryParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `QueryParser`.
 */
export interface QueryParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `QueryParser.input`.
	 * @param ctx the parse tree
	 */
	enterInput?: (ctx: InputContext) => void;
	/**
	 * Exit a parse tree produced by `QueryParser.input`.
	 * @param ctx the parse tree
	 */
	exitInput?: (ctx: InputContext) => void;

	/**
	 * Enter a parse tree produced by `QueryParser.query`.
	 * @param ctx the parse tree
	 */
	enterQuery?: (ctx: QueryContext) => void;
	/**
	 * Exit a parse tree produced by `QueryParser.query`.
	 * @param ctx the parse tree
	 */
	exitQuery?: (ctx: QueryContext) => void;

	/**
	 * Enter a parse tree produced by `QueryParser.param`.
	 * @param ctx the parse tree
	 */
	enterParam?: (ctx: ParamContext) => void;
	/**
	 * Exit a parse tree produced by `QueryParser.param`.
	 * @param ctx the parse tree
	 */
	exitParam?: (ctx: ParamContext) => void;

	/**
	 * Enter a parse tree produced by `QueryParser.ignored`.
	 * @param ctx the parse tree
	 */
	enterIgnored?: (ctx: IgnoredContext) => void;
	/**
	 * Exit a parse tree produced by `QueryParser.ignored`.
	 * @param ctx the parse tree
	 */
	exitIgnored?: (ctx: IgnoredContext) => void;

	/**
	 * Enter a parse tree produced by `QueryParser.paramNamed`.
	 * @param ctx the parse tree
	 */
	enterParamNamed?: (ctx: ParamNamedContext) => void;
	/**
	 * Exit a parse tree produced by `QueryParser.paramNamed`.
	 * @param ctx the parse tree
	 */
	exitParamNamed?: (ctx: ParamNamedContext) => void;

	/**
	 * Enter a parse tree produced by `QueryParser.paramIndexed`.
	 * @param ctx the parse tree
	 */
	enterParamIndexed?: (ctx: ParamIndexedContext) => void;
	/**
	 * Exit a parse tree produced by `QueryParser.paramIndexed`.
	 * @param ctx the parse tree
	 */
	exitParamIndexed?: (ctx: ParamIndexedContext) => void;

	/**
	 * Enter a parse tree produced by `QueryParser.formatter`.
	 * @param ctx the parse tree
	 */
	enterFormatter?: (ctx: FormatterContext) => void;
	/**
	 * Exit a parse tree produced by `QueryParser.formatter`.
	 * @param ctx the parse tree
	 */
	exitFormatter?: (ctx: FormatterContext) => void;
}

