import * as express from "express";
import {ResponseWithContext} from "../definitions";
import {log} from "../../logger";

const _module = "routes/response";

type ApiResponse = {
    status : number;
    json : {
        status   : "Success" | "Error" | "Failed";
        message  : string;
        subText  : string | null;
        data     : object | null;
        error    : Error  | null;
    }
};

type ApiResponseSignature = ({data, subText, error}) => ApiResponse;

const success : ApiResponseSignature
    = ({data = null, subText = null, error = null}) => ({
    status: 200,
    json: {
        status  : 'Success',
        message : 'Request successfully completed.',
        subText,
        data,
        error
    }
});

const error : ApiResponseSignature
    = ({data = null, subText = null, error = null}) => ({
    status: 400,
    json: {
        status  : 'Error',
        message : 'Error happened while processing request.',
        data,
        subText,
        error
    }
});

const missingRequirements : ApiResponseSignature
    = ({data = null, subText = null, error = null}) => ({
    status: 400,
    json: {
        status  : 'Error',
        message : 'Missing requirements',
        data,
        subText,
        error
    }
});

const dataRetrieved : ApiResponseSignature
    = ({data = null, subText = null, error = null}) => ({
    status: 200,
    json: {
        status  : 'Success',
        message : 'Requested data retrieved.',
        data,
        subText,
        error
    }
});

const internalError : ({error : Error}) => ApiResponse
    = ({error}) => ({
    status : 500,
    json : {
        status  : "Failed",
        message : 'There is no response details.',
        subText : null,
        data    : null,
        error   : error && error.message ? error.message : error
    }
});

const notFound : ApiResponseSignature
    = ({data = null, subText = null, error = null}) => ({
    status : 404,
    json : {
        status  : "Failed",
        message : 'Not found',
        subText,
        data,
        error
    }
})

const responseMap = {
    success,
    error,
    missingRequirements,
    dataRetrieved,
    notFound
};

export type ResponseStatus = keyof typeof responseMap;

export type ResponseParams = {
    res      : express.Response;
    type     : ResponseStatus;
    data    ?: object;
    error   ?: Error;
    subText ?: string;
}

export const respond = ({res, type, data, subText, error} : ResponseParams) : void => {
    const method = "respond";
    const response = res as ResponseWithContext;
    const details : ApiResponse = responseMap[type] && responseMap[type]({data, subText, error}) || internalError({error});
    const {context} = response;
    const {status, json} = details;
    log.debug({context, module : _module, method, message : "", details : {status, json}});
    response.status(status).json(json);
};
