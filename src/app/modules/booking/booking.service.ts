import { format } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CarConstants } from '../car/car.constant';
import Car from '../car/car.model';
import { TRider } from '../rider/rider.interface';
import Rider from '../rider/rider.model';
import { UserConstants } from '../user/user.constant';
import { TUser } from '../user/user.interface';
import User from '../user/user.model';
import { BookingConstants } from './booking.constant';
import { TBooking } from './booking.interface';
import Booking from './booking.model';
import { BookingUtils } from './booking.utils';

const createBookingsInToDB = async (payload: TBooking & Partial<TRider>) => {
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
        $and: [
            {
                status: {
                    $ne: BookingConstants.BookingStatus.completed,
                },
            },
            {
                status: {
                    $ne: BookingConstants.BookingStatus.approved,
                },
            },
            {
                paymentStatus: {
                    $ne: BookingConstants.PaymentStatus.completed,
                },
            },
        ],
    });
    return bookings;
};

const updateBookingInToDB = async (
    id: string,
    payload: Partial<TBooking>,
    user: TUser | JwtPayload
) => {
    const booking = await Booking.findById(id);

    if (!booking) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Booking not found!');
    }

    switch (booking?.status) {
        case BookingConstants.BookingStatus.completed:
            throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Can't update completed booking!");
        case BookingConstants.BookingStatus.approved:
            throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Can't update approved booking!");
        case BookingConstants.BookingStatus.canceled:
            throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Can't update canceled booking!");

        default:
            break;
    }

    let result;

    if (
        user?.role === UserConstants.UserRoles.admin ||
        user?.role === UserConstants.UserRoles.superAdmin
    ) {
        if (payload?.status === 'canceled') {
            payload.isApproved = false;
        }
        if (payload?.status === 'approved' || payload?.status === 'completed') {
            payload.isApproved = true;
        }
        result = await Booking.findByIdAndUpdate(id, payload, { new: true });
    } else {
        const limitField = { ...payload };
        delete limitField?.isApproved;
        delete limitField?.status;
        delete limitField?.endTime;

        result = await Booking.findByIdAndUpdate(id, limitField, { new: true });
    }

    return result;
};

const deleteBookingFromDB = async (id: string) => {
    const result = await Booking.findByIdAndDelete(id);
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Booking not found!');
    }
    return result;
};

const bookingsPayment = async (
    id: string,
    payload: {
        nidNumber?: string;
        passportNumber?: string;
        drivingLicenseNumber: string;
    }
) => {
    const booking = await Booking.findById(id);
    if (!booking) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Booking not found!');
    }
    if (!booking?.isApproved) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Booking is not approved yet!');
    }
    if (booking?.status === BookingConstants.BookingStatus.canceled) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Booking has been canceled!');
    }
    if (booking?.status !== BookingConstants.BookingStatus.completed) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Sorry can't pay. Car didn't returned!");
    }
    if (booking?.paymentStatus !== BookingConstants.PaymentStatus.pending) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Payment already completed!');
    }

    const user = await User.findById(booking?.user);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    const rider = await Rider.findOne({ user: user?._id });

    if (!rider) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    const car = await Car.findById(booking?.car);

    if (!car) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Car not found!');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const paymentData = {
            startTime: booking?.startTime,
            endTime: booking?.endTime,
            user,
            car,
        };

        const stripePayment = await BookingUtils.makeStripePayment(paymentData);

        const updatedRider = await Rider.findByIdAndUpdate(rider?._id, payload, {
            new: true,
            session,
        });

        if (!updatedRider) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update Rider!');
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            booking?._id,
            { paymentStatus: BookingConstants.PaymentStatus.completed },
            { session, new: true }
        );

        if (!updatedBooking) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update Booking!');
        }

        await session.commitTransaction();
        await session.endSession();
        return stripePayment;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error);
    }
};

export const BookingServices = {
    createBookingsInToDB,
    getAllBookingsFromDB,
    getUsersUpcomingBookings,
    updateBookingInToDB,
    deleteBookingFromDB,
    bookingsPayment,
};
