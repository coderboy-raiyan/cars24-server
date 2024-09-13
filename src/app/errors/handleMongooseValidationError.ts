import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../types';

function handleMongooseValidationError(
    error: mongoose.Error.ValidationError
): TGenericErrorResponse {
    const errorSources: TErrorSources = Object.values(error.errors).map((err) => {
        return {
            path: err?.path,
            message: err?.message,
        };
    });
    return {
        statusCode: StatusCodes.BAD_REQUEST,
        errorSources,
        message: 'Validation error!',
    };
}

export default handleMongooseValidationError;
