import * as fs from "fs";
import {log}   from "../logger";
import {ReadStream} from "fs";
// import {ReadWriter} from "./ReadWriter";

const _module = "fileReadWriter";

export class FileReadWriter { // TODO: Reader to allow fs or s3 etc

    public getFileSize({context, filePathName}) : Promise<{fileSize : number}> {
        const method = "getFileSize";
        log.debug({context, module : _module, method, message : "begin get file size", details : {filePathName}});
        const result : Promise<{fileSize : number}> = new Promise((resolve, reject) => {
            fs.stat(filePathName, (error, stats) => {
                if (error) {
                    log.error({context, module : _module, method, message : "failed get file size", details : {filePathName}});
                    reject(error);
                } else {
                    log.debug({context, module : _module, method, message : "success get file size", details : {filePathName}});
                    resolve({fileSize : stats.size});
                }
            })
        });
        return result;
    }

    public removeFile({context, path, fileName, extension}) : Promise<void> {
        const method = "removeFile";
        log.debug({context, module : _module, method, message: "begin remove file", details : {fileName}});
        const result : Promise<void> = new Promise((resolve, reject) => {
            fs.unlink(`${path}/${fileName}.${extension}`, error => {
                if (error) {
                    log.error({context, module : _module, method, message: "failed to remove file", details : {fileName}});
                    reject(error);
                } else {
                    log.debug({context, module : _module, method, message: "success remove file", details : {fileName}});
                    resolve();
                }
            })
        });
        return result;
    }

    public writeToFile({context, input, path, fileName, extension}) : Promise<{fileName : string}> {
        const method = "writeToFile";
        log.debug({context, module : _module, method, message: "begin write to file", details : {fileName}});
        const result : Promise<{fileName : string}> = new Promise((resolve, reject) => {
            input.pipe(fs.createWriteStream(`${path}/${fileName}.${extension}`));
            input.on("error", error => {
                log.error({context, module : _module, method, message: "failed to write to file", details : {fileName}});
                reject(error);
            });
            input.on("end", data => {
                log.debug({context, module : _module, method, message: "END: success to write to file", details : {fileName, data}});
                resolve({fileName});
            });
            input.on("finish", data => {
                log.debug({context, module : _module, method, message: "FINISH: success to write to file", details : {fileName, data}});
                resolve({fileName});
            })
        });
        return result;
    }

    public readFile({context, path, fileName, extension}) : ReadStream {
        const method = "readFile";
        log.debug({context, module : _module, method, message : "begin read file", details : {fileName, extension}});
        return fs.createReadStream(`${path}/${fileName}.${extension}`);
    }
}
