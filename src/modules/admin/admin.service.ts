import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../app/errors/AppError';
import { generateAccessToken } from '../../app/utils/jwt';
import { UserConstants } from '../user/user.constant';
import User from '../user/user.model';
import { TAdmin } from './admin.interface';
import Admin from './admin.model';

const registerAdminIntoDB = async (payload: TAdmin & { password: string }) => {
    const isUserExits = await User.findOne({ email: payload?.email });

    if (isUserExits) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Already have an account. Please Sign up!');
    }

    const admin = await Admin.findOne({ email: payload?.email });

    if (admin) {
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Already have an account. Please Sign in!'
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const userData = {
            email: payload?.email,
            password: payload?.password,
            role: UserConstants.UserRoles.admin,
        };

        const user = await User.create([userData], { session });
        if (!user) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Couldn't create user!");
        }

        const adminData = { ...payload, user: user[0]?._id };
        delete adminData?.password;
        const admin = await Admin.create([adminData], { session });

        if (!admin) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Couldn't create rider!");
        }

        const accessToken = generateAccessToken({
            _id: admin[0]?._id,
            email: admin[0]?.email,
            role: user[0]?.role,
        });
        const refreshToken = generateAccessToken({
            _id: admin[0]?._id,
            email: admin[0]?.email,
            role: user[0]?.role,
        });

        await session.commitTransaction();
        await session.endSession();

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error);
    }
};

export const AdminServices = {
    registerAdminIntoDB,
};
