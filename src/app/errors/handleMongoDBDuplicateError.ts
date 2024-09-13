/* eslint-disable @typescript-eslint/no-explicit-any */

import { StatusCodes } from 'http-status-codes';
import { TErrorSources, TGenericErrorResponse } from '../types';

function handleMongoDBDuplicateError(error: any): TGenericErrorResponse {
    const errorSources: TErrorSources = [
        {
            path: Object.keys(error.keyValue)[0],
            message: `${Object.values(error.keyValue)[0]} is already exists`,
        },
    ];
    return {
        statusCode: StatusCodes.NOT_ACCEPTABLE,
        message: `${Object.values(error.keyValue)[0]} is already exists`,
        errorSources,
    };
}

export default handleMongoDBDuplicateError;
