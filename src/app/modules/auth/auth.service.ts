import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { generateAccessToken } from '../../utils/jwt';
import Admin from '../admin/admin.model';
import Rider from '../rider/rider.model';
import { UserConstants } from '../user/user.constant';
import User from '../user/user.model';

const loginUserFromDB = async (payload: { email: string; password: string }) => {
    const user = await User.findOne({ email: payload?.email });

    if (!user) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Don't have an account. Please Sign up!");
    }

    if (user?.isDeleted) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'User has been deleted!');
    }

    const verifyPassword = await bcrypt.compare(payload?.password, user?.password);

    if (!verifyPassword) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Wrong password please try again!');
    }

    let authorizedUser;

    switch (user?.role) {
        case UserConstants.UserRoles.admin:
            authorizedUser = await Admin.findById(user?._id);
            break;
        case UserConstants.UserRoles.rider:
            authorizedUser = await Rider.findById(user?._id);
            break;

        case UserConstants.UserRoles.superAdmin:
            authorizedUser = user;
            break;
        default:
            break;
    }

    const accessToken = generateAccessToken({
        _id: user?._id,
        email: authorizedUser?.email,
        role: user?.role,
    });
    const refreshToken = generateAccessToken({
        _id: user?._id,
        email: authorizedUser?.email,
        role: user?.role,
    });

    return {
        accessToken,
        refreshToken,
    };
};

const AuthServices = {
    loginUserFromDB,
};

export default AuthServices;
