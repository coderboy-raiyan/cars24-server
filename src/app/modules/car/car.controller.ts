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
const getAllCars = catchAsync(async (req, res) => {
    const result = await CarServices.getAllCarsFromDB();
    sendResponse(res, {
        success: true,
        message: 'Car retrieved Successfully',
        statusCode: StatusCodes.OK,
        data: result,
    });
});
const getSingleCars = catchAsync(async (req, res) => {
    const result = await CarServices.getSingleCarsFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        message: 'Car retrieved Successfully',
        statusCode: StatusCodes.OK,
        data: result,
    });
});
const updateCar = catchAsync(async (req, res) => {
    const result = await CarServices.updateCarIntoDB(
        req.params.id,
        req.body,
        req.files as Express.Multer.File[]
    );
    sendResponse(res, {
        success: true,
        message: 'Car updated Successfully',
        statusCode: StatusCodes.OK,
        data: result,
    });
});

export const CarControllers = {
    createCar,
    getAllCars,
    updateCar,
    getSingleCars,
};
