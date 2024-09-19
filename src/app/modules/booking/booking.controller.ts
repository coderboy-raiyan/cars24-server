import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
    const result = await BookingServices.createBookingsInToDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Car has been booked successfully',
        data: result,
    });
});

export const BookingControllers = {
    createBooking,
};
