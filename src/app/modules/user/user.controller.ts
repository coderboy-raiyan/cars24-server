import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const getMe = catchAsync(async (req, res) => {
    const result = await UserServices.getMe(req?.user?._id, req?.user?.role);
    sendResponse(res, {
        success: true,
        message: 'Profile retrieved successfully',
        statusCode: StatusCodes.OK,
        data: result,
    });
});

export const UserControllers = {
    getMe,
};
