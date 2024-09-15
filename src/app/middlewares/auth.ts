/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import User from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

function auth(...requiredRoles: TUserRole[]) {
    return catchAsync(async (req, res, next) => {
        const token = req?.headers?.authorization?.split('Bearer ')[1];

        if (!token) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
        }

        let decodedToken;

        try {
            decodedToken = jwt.verify(token, config.JWT_ACCESS_SECRET);
        } catch (error: any) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token!');
        }

        if (!requiredRoles.includes(decodedToken?.role)) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not allowed!');
        }

        const user = await User.findOne({ _id: decodedToken?._id });

        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
        }

        req.user = user;
        next();
    });
}

export default auth;
