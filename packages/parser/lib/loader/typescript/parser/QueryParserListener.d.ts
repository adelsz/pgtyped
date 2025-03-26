import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener.js";
import { InputContext } from "./QueryParser.js";
import { QueryContext } from "./QueryParser.js";
import { ParamContext } from "./QueryParser.js";
import { IgnoredContext } from "./QueryParser.js";
import { ScalarParamContext } from "./QueryParser.js";
import { PickParamContext } from "./QueryParser.js";
import { ArrayPickParamContext } from "./QueryParser.js";
import { ArrayParamContext } from "./QueryParser.js";
import { ScalarParamNameContext } from "./QueryParser.js";
import { ParamNameContext } from "./QueryParser.js";
import { PickKeyContext } from "./QueryParser.js";
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
     * Enter a parse tree produced by `QueryParser.scalarParam`.
     * @param ctx the parse tree
     */
    enterScalarParam?: (ctx: ScalarParamContext) => void;
    /**
     * Exit a parse tree produced by `QueryParser.scalarParam`.
     * @param ctx the parse tree
     */
    exitScalarParam?: (ctx: ScalarParamContext) => void;
    /**
     * Enter a parse tree produced by `QueryParser.pickParam`.
     * @param ctx the parse tree
     */
    enterPickParam?: (ctx: PickParamContext) => void;
    /**
     * Exit a parse tree produced by `QueryParser.pickParam`.
     * @param ctx the parse tree
     */
    exitPickParam?: (ctx: PickParamContext) => void;
    /**
     * Enter a parse tree produced by `QueryParser.arrayPickParam`.
     * @param ctx the parse tree
     */
    enterArrayPickParam?: (ctx: ArrayPickParamContext) => void;
    /**
     * Exit a parse tree produced by `QueryParser.arrayPickParam`.
     * @param ctx the parse tree
     */
    exitArrayPickParam?: (ctx: ArrayPickParamContext) => void;
    /**
     * Enter a parse tree produced by `QueryParser.arrayParam`.
     * @param ctx the parse tree
     */
    enterArrayParam?: (ctx: ArrayParamContext) => void;
    /**
     * Exit a parse tree produced by `QueryParser.arrayParam`.
     * @param ctx the parse tree
     */
    exitArrayParam?: (ctx: ArrayParamContext) => void;
    /**
     * Enter a parse tree produced by `QueryParser.scalarParamName`.
     * @param ctx the parse tree
     */
    enterScalarParamName?: (ctx: ScalarParamNameContext) => void;
    /**
     * Exit a parse tree produced by `QueryParser.scalarParamName`.
     * @param ctx the parse tree
     */
    exitScalarParamName?: (ctx: ScalarParamNameContext) => void;
    /**
     * Enter a parse tree produced by `QueryParser.paramName`.
     * @param ctx the parse tree
     */
    enterParamName?: (ctx: ParamNameContext) => void;
    /**
     * Exit a parse tree produced by `QueryParser.paramName`.
     * @param ctx the parse tree
     */
    exitParamName?: (ctx: ParamNameContext) => void;
    /**
     * Enter a parse tree produced by `QueryParser.pickKey`.
     * @param ctx the parse tree
     */
    enterPickKey?: (ctx: PickKeyContext) => void;
    /**
     * Exit a parse tree produced by `QueryParser.pickKey`.
     * @param ctx the parse tree
     */
    exitPickKey?: (ctx: PickKeyContext) => void;
}
