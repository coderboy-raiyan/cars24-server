import { Response } from 'express';

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
};

function sendResponse<T>(res: Response, { statusCode, success, message, data }: TResponse<T>) {
    return res.status(statusCode).json({ success, message, data });
}

export default sendResponse;
