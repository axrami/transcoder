
export interface Transcoder { // TODO: generics
    transcode : ({context, input, convertTo, id, extension}) => Promise<any>;
}
