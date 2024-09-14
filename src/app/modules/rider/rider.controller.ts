import { StatusCodes } from 'http-status-codes';
import { config } from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RiderServices } from './rider.service';

const register = catchAsync(async (req, res) => {
    const result = await RiderServices.registerRidersIntoDB(req.body);

    res.cookie('refreshToken', result?.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Signed up successfully. Please verify your email',
        data: { accessToken: result?.accessToken },
    });
});

export const RiderControllers = {
    register,
};
