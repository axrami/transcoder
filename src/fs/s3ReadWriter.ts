import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as zlib from "zlib";
import * as streamingS3 from "streaming-s3";

export class S3ReadWriter {
    private _s3 : any;
    private _accessKeyId : string;
    private _secretAccessKey : string;


    constructor() {
        this._accessKeyId = "";
        this._secretAccessKey = "";
        AWS.config.update({
            accessKeyId : this._accessKeyId,
            secretAccessKey : this._secretAccessKey
        });
        this._s3 = new AWS.S3();
    }

    public writeToFile() {

    }

    // https://stackoverflow.com/questions/21657700/s3-file-upload-stream-using-node-js
    // https://www.npmjs.com/package/streaming-s3

    public uploadFile() {
        const fStream = fs.createReadStream('filePath');
        const s3Obj = new AWS.S3({
            params : {
                Bucket: 'myBucket',
                Key: 'myKey'
            }
        });

        var uploader = new streamingS3(fStream, {accessKeyId: 'accessKey', secretAccessKey: 'secretKey'},
            {
                Bucket: 'example.streaming-s3.com',
                Key: 'video.mp4',
                ContentType: 'video/mp4'
            }
        );

        // s3Obj.upload({Body : file})
        //     .on('httpUploadProgress', evt => {
        //         console.log(evt);
        //     })
        //     .send((err, data) => {
        //         console.log(err, data);
        //     })

    }

}
