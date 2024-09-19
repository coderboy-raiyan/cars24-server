import { format } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CarConstants } from '../car/car.constant';
import Car from '../car/car.model';
import User from '../user/user.model';
import { TBooking } from './booking.interface';
import Booking from './booking.model';

const createBookingsInToDB = async (payload: TBooking) => {
    const user = await User.findById(payload?.user);

    if (!user || user?.isDeleted) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    const car = await Car.findById(payload?.car);

    if (!car || car?.status === CarConstants.CarStatus.unavailable) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Car is not available!');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const booking = await Booking.create([{ ...payload }], { session });

        if (!booking) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't create booking!");
        }

        await Car.findByIdAndUpdate(
            car._id,
            { status: CarConstants.CarStatus.unavailable },
            { session }
        );

        await session.commitTransaction();
        await session.endSession();
        return booking[0];
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error);
    }
};

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
    const BookingModelQuery = new QueryBuilder(Booking, query).filter(['date']).sort();
    const bookings = await BookingModelQuery.ModelQuery;
    return bookings;
};

const getUsersUpcomingBookings = async (id: string) => {
    const bookings = await Booking.find({
        user: id,
        date: { $gte: format(new Date(), 'yyyy-MM-dd') },
        startTime: { $gte: format(new Date(), 'HH:mm') },
    });
    return bookings;
};

export const BookingServices = {
    createBookingsInToDB,
    getAllBookingsFromDB,
    getUsersUpcomingBookings,
};
