import * as express      from "express";
import * as uuid         from "uuid";
import {log}             from "../../logger/index";
import {respond}         from "../helpers/response";
import {AudioTranscoder} from "../../audio/transcoder";
import { RequestWithContext } from "../definitions";
import {FileReadWriter} from "../../fs/fileReadWriter";

const _module = "routes/upload";
const audioTranscocder = new AudioTranscoder();
const filesys = new FileReadWriter();
const path = "/Users/aramirez/Development/transcoder/files"; // config
const router : express.Router = express.Router();

router.get("/api", (_req, res) => {
    respond({res, type : "success"});
});

router.get("/api/audio/:id", (req, res) => {
    const method = "get/api/auid/:id";
    const request = req as RequestWithContext;
    const {context, params} = request;
    const {id : fileName} = params;
    const {extension} = request.query;
    log.debug({context, module : _module, method, message : "Received reqeust to get file id:" + params.id});
    if (!fileName || !extension) {
        respond({res, type : "missingRequirements"});
    }
    res.writeHead(200, {
        'Content-Type' : "audio/*",
        'Transfer-Encoding': 'chunked'
    });
    const reaStream = filesys.readFile({context, path, fileName, extension});
    reaStream.pipe(res);
    reaStream.on("error", error => {
        log.error({context, module : _module, method, message : "failure reading file", details : error});
        // respond({res, type : "error", error});
    });
    reaStream.on("end", data => {
        console.log(data);
    })
});

router.post("/api/audio", (req : express.Request, res : express.Response) => {
    const method = "post/api/audio";
    const request = req as RequestWithContext;
    const {context, body} = request;
    const id = uuid();
    const convertTo = "mp3";
    const data = {
        fileId : id,
        extension : convertTo
    };
    log.debug({context, module : _module, method, details : body});
    audioTranscocder.transcode({context, input : req, convertTo, extension : "amr", id })
        .then(() => respond({res, type : "success", data, subText : "Audio being transcoded"}))
        .catch((error : Error) => respond({res, type : "error", data, subText : "Failed processing file", error}))
});

export { router }
