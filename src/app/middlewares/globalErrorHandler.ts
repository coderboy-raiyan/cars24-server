/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { config } from '../config';
import AppError from '../errors/AppError';
import handleMongoDBCastError from '../errors/handleMongoDBCastError';
import handleMongoDBDuplicateError from '../errors/handleMongoDBDuplicateError';
import handleMongooseValidationError from '../errors/handleMongooseValidationError';
import handleZodError from '../errors/handleZodError';
import { TErrorSources } from '../types';

function globalErrorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let errorSources: TErrorSources = [];

    if (error instanceof ZodError) {
        const modifiedError = handleZodError(error);
        statusCode = modifiedError.statusCode;
        message = modifiedError.message;
        errorSources = modifiedError.errorSources;
    } else if (error?.name === 'CastError') {
        const modifiedError = handleMongoDBCastError(error);
        statusCode = modifiedError.statusCode;
        message = modifiedError.message;
        errorSources = modifiedError.errorSources;
    } else if (error?.code === 11000) {
        const modifiedError = handleMongoDBDuplicateError(error);
        statusCode = modifiedError.statusCode;
        message = modifiedError.message;
        errorSources = modifiedError.errorSources;
    } else if (error?.name === 'ValidationError') {
        const modifiedError = handleMongooseValidationError(error);
        statusCode = modifiedError.statusCode;
        message = modifiedError.message;
        errorSources = modifiedError.errorSources;
    } else if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        errorSources = [
            {
                path: '',
                message: error.message,
            },
        ];
    } else if (error instanceof Error) {
        message = error.message;
        errorSources = [
            {
                path: '',
                message: error.message,
            },
        ];
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.NODE_ENV === 'development' ? error.stack : null,
    });
}

export default globalErrorHandler;
