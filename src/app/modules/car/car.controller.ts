import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CarServices } from './car.service';

const createCar = catchAsync(async (req, res) => {
    const result = await CarServices.createCarInToDB(req.body, req.files as Express.Multer.File[]);
    sendResponse(res, {
        success: true,
        message: 'Car created Successfully',
        statusCode: StatusCodes.OK,
        data: result,
    });
});

export const CarControllers = {
    createCar,
};
