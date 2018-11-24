import * as express from "express";
import { Context } from "../contex";

export type RequestWithContext = express.Request & {context : Context};
export type ResponseWithContext = express.Response & {context : Context};
