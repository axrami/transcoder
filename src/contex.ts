import * as uuid from "uuid";

export type JobType = "audio";
export type JobAction = "transcode" | "getFile";

export type Context = {
    id      : string;
    start   : number;
    jobType : JobType | null;
    action  : JobAction | null;
}

export const makeContext = () : Context => ({
    id      : uuid(),
    start   : Date.now(),
    jobType : null,
    action : null
});
