import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';

function notFound(req: Request, res: Response, next: NextFunction) {
    return next(new AppError(StatusCodes.NOT_FOUND, 'Route not found!'));
}

export default notFound;
