import * as express from "express";
import * as audio from "./api/audio";

export const routes : Array<express.Router> = [audio.router];
