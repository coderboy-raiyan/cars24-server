import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../types';

function handleZodError(zodError: ZodError): TGenericErrorResponse {
    const errorSources: TErrorSources = zodError.issues.map(({ path, message }) => {
        return {
            path: path[path.length - 1],
            message,
        };
    });

    return {
        errorSources,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Validation error',
    };
}

export default handleZodError;
