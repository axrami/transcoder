
export type LogData = {
    context ?: object;
    module   : string;
    method   : string;
    message ?: string;
    details ?: object;
}

export class Logger {

    _parse(obj) {
        try {
            return JSON.stringify(obj);
        } catch(e) {
            return "Failed to parse";
        }
    }

    _log(type : string, str : string) {
        console.log(`${type}:${str}`);
    }

    trace(data : LogData) {
        this._log("[TRACE]", this._parse(data));
    }

    debug(data : LogData) {
        this._log("[DEBUG]", this._parse(data));
    }

    info(data : LogData) {
        this._log("[INFO]", this._parse(data));
    }

    warn(data : LogData) {
        this._log("[WARN]", this._parse(data));
    }

    error(data : LogData) {
        this._log("[ERROR]", this._parse(data));
    }
}
