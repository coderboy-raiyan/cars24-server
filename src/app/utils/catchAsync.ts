import { NextFunction, Request, RequestHandler, Response } from 'express';

function catchAsync(fn: RequestHandler) {
    return async function (req: Request, res: Response, next: NextFunction) {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
}

export default catchAsync;
