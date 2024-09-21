import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TUser } from '../user/user.interface';
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
    const result = await CarServices.getAllCarsFromDB(req.query);
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
const deleteCar = catchAsync(async (req, res) => {
    const result = await CarServices.deleteCarFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        message: 'Car deleted Successfully',
        statusCode: StatusCodes.OK,
        data: result,
    });
});
const returnCar = catchAsync(async (req, res) => {
    const result = await CarServices.returnCar(req.body, req.user as TUser);
    sendResponse(res, {
        success: true,
        message: 'Car returned Successfully',
        statusCode: StatusCodes.OK,
        data: result,
    });
});

export const CarControllers = {
    createCar,
    getAllCars,
    updateCar,
    getSingleCars,
    deleteCar,
    returnCar,
};
