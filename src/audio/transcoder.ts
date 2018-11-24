import * as ffmpeg      from 'fluent-ffmpeg';
import {log}            from "../logger";
import { Transcoder }   from "./definitions";
import {FileReadWriter} from "../fs/fileReadWriter";

const path = "/Users/aramirez/Development/transcoder/files";
const _module = "transcoder";

export class AudioTranscoder implements Transcoder {
    private readonly _filesys : FileReadWriter;

    constructor() {
        this._filesys = new FileReadWriter();
    }

    private _transcodeAudio({context, path, fileName, extension, convertTo}) : Promise<{fileName : string}> {
        const method = "_transcodeAudio";
        const savePath = `${path}/${fileName}.${convertTo}`;
        log.debug({context, module : _module, method, message : "begin transcode", details : {fileName, convertTo}});
        const result : Promise<{fileName : string}> = new Promise((resolve, reject) => {
            ffmpeg(`${path}/${fileName}.${extension}`)
                .toFormat(convertTo)
                .on('error', error => {
                    log.error({context, module : _module, method, message : "failed transcode audio", details : error});
                    reject(error);
                })
                .on('end', () => {
                    log.debug({context, module : _module, method, message : "success transcode", details : {fileName, convertTo}});
                    resolve({fileName : `${fileName}.${convertTo}`});
                })
                .save(savePath);
        });
        return result;
    }

    public transcode({context, input, convertTo, id, extension}) : Promise<void> {
        const method = "transcode";
        const fileName = id;
        log.debug({context, module : _module, method, message : "begin transcode audio", details : {fileName}});
        const pipeRead : Promise<void> = new Promise((resolve, reject) => {
            const result = Promise.resolve()
                .then(() => this._filesys.writeToFile({context, input, path, fileName, extension}))
                .then(() => {
                    resolve(); // resolve data is read to not block response
                    return this._transcodeAudio({context, path, fileName, extension, convertTo})
                })
                .then(() => this._filesys.removeFile({context, path, fileName, extension}))
                .then(() => {
                    log.debug({context, module : _module, method, message : "success transcode audio", details : {fileName}});
                })
                .catch(error => {
                    log.error({context, module : _module, method, message : "failed transcode audio", details : {error}});
                    reject(error);
                });
            return result;
        });
        return pipeRead;
    }
}