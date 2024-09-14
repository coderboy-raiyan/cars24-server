import { StatusCodes } from 'http-status-codes';
import { config } from '../../app/config';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import AuthServices from './auth.service';

const login = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUserFromDB(req.body);

    res.cookie('refreshToken', result?.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Signed in successfully',
        data: { accessToken: result?.accessToken },
    });
});

export const AuthControllers = {
    login,
};
