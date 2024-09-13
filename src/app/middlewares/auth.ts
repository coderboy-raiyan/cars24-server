import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';
import AppError from '../errors/AppError';
import Admin from '../modules/admin/admin.model';
import Customer from '../modules/customer/customer.model';
import { UserConstants } from '../modules/user/user.constant';
import { TUserRole } from '../modules/user/user.interface';
import User from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

function auth(...roles: TUserRole[]) {
    return catchAsync(async (req, res, next) => {
        const token = req?.headers?.authorization?.split('Bearer ')[1];

        if (!token) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Access denied. No token provided.');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
        } catch (error) {
            throw new Error(error);
        }
        if (!decoded) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized!');
        }

        const { _id, role } = decoded as JwtPayload;

        // Find the user from User table/collection
        const genericUser = await User.findById(_id, { _id: 1 });

        if (!genericUser) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
        }

        // Find the user from specific Role based table/collection
        let user;

        switch (role) {
            case UserConstants.USER_ROLE.admin:
                user = await Admin.findOne({ user: genericUser?._id }, { email: 1 });
                break;
            case UserConstants.USER_ROLE.customer:
                user = await Customer.findOne({ user: genericUser?._id }, { email: 1 });
                break;

            default:
                break;
        }

        if (!roles.includes(role)) {
            throw new AppError(
                StatusCodes.FORBIDDEN,
                'You are not authorized to access this action!'
            );
        }

        req.user = user.toObject();
        next();
    });
}

export default auth;
