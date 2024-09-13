import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../types';

function handleMongoDBCastError(error: mongoose.Error.CastError): TGenericErrorResponse {
    const errorSources: TErrorSources = [
        {
            path: error.path,
            message: error.message,
        },
    ];

    return {
        errorSources,
        message: `Failed to convert ${error.path} which is invalid!`,
        statusCode: StatusCodes.BAD_REQUEST,
    };
}

export default handleMongoDBCastError;
