import * as express     from "express";
import * as _           from "lodash";
import * as path        from "path";
import {respond}        from "./routes/helpers/response";
import {log}            from "./logger";
import * as routes      from "./routes";
import { Context, makeContext } from "./contex";

const _module = "index";
const port = 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use((req : express.Request & {context ?: Context}, res : express.Response & {context ?: Context}, next : express.NextFunction) => {
    const context = makeContext();
    req.context = context;
    res.context = context;
    log.debug({context, module : _module, method : "entry", message : "incoming request"});
    next();
});

_.forEach(routes, route => {
    app.use("/api", route);
});

app.use((_req : Express.Request, res) => {
    respond({type : "notFound", res});
});

app.listen(port, () => {
    console.log("listening on port:" + port);
});
