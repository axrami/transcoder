import * as uuid from "uuid";

export type Context = {
    id      : string;
    start   : number;
}

export const makeContext = () : Context => ({
    id      : uuid(),
    start   : Date.now()
});
