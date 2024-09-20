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
const getAllBookings = catchAsync(async (req, res) => {
    const result = await BookingServices.getAllBookingsFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Bookings retrieved successfully',
        data: result,
    });
});
const getUsersUpcomingBookings = catchAsync(async (req, res) => {
    const result = await BookingServices.getUsersUpcomingBookings(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Bookings retrieved successfully',
        data: result,
    });
});
const updateBookings = catchAsync(async (req, res) => {
    const result = await BookingServices.updateBookingInToDB(req.params.id, req.body, req.user);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Bookings updated successfully',
        data: result,
    });
});
const deleteBookings = catchAsync(async (req, res) => {
    const result = await BookingServices.deleteBookingFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Bookings deleted successfully',
        data: result,
    });
});

export const BookingControllers = {
    createBooking,
    getAllBookings,
    getUsersUpcomingBookings,
    updateBookings,
    deleteBookings,
};
