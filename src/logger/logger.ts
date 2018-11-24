import * as util from "util";
import { Context } from "../contex";

export type LogData = {
    context  : Context;
    module   : string;
    method   : string;
    message ?: string;
    details ?: object;
}

export class Logger {

    _log(type : string, str : string) {
        console.log(`${type}:${str}`);
    }

    trace(data : LogData) {
        this._log("[TRACE]", util.inspect(data));
    }

    debug(data : LogData) {
        this._log("[DEBUG]", util.inspect(data));
    }

    info(data : LogData) {
        this._log("[INFO]", util.inspect(data));
    }

    warn(data : LogData) {
        this._log("[WARN]", util.inspect(data));
    }

    error(data : LogData) {
        this._log("[ERROR]", util.inspect(data));
    }
}