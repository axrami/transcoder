
export interface Transcoder {
    transcode : ({context, input, convertTo, id, extension}) => Promise<any>;
}
