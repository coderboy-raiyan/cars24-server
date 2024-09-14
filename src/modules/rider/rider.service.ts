import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../app/errors/AppError';
import { generateAccessToken } from '../../app/utils/jwt';
import { UserConstants } from '../user/user.constant';
import User from '../user/user.model';
import { TRider } from './rider.interface';
import Rider from './rider.model';

const registerRidersIntoDB = async (payload: TRider & { password: string }) => {
    const rider = await Rider.findOne({ email: payload?.email });

    if (rider) {
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
            role: UserConstants.UserRoles.rider,
        };

        const user = await User.create([userData], { session });
        if (!user) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Couldn't create user!");
        }

        const riderData = { ...payload, user: user[0]?._id };
        delete riderData?.password;
        const rider = await Rider.create([riderData], { session });

        if (!rider) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Couldn't create rider!");
        }

        const accessToken = generateAccessToken({
            _id: rider[0]?._id,
            email: rider[0]?.email,
            role: user[0]?.role,
        });
        const refreshToken = generateAccessToken({
            _id: rider[0]?._id,
            email: rider[0]?.email,
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

export const RiderServices = {
    registerRidersIntoDB,
};
