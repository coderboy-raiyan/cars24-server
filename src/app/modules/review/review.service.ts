import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { BookingConstants } from '../booking/booking.constant';
import Booking from '../booking/booking.model';
import Car from '../car/car.model';
import { TReview } from './review.interface';
import Review from './review.model';

const createReviewInToDB = async (payload: TReview) => {
    const car = await Car.findById(payload?.car);

    if (!car) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Car not found!');
    }

    const verifyUserBooking = await Booking.findOne(
        {
            user: payload?.user,
            car: payload?.car,
            status: BookingConstants.BookingStatus.completed,
        },
        { _id: 1 }
    ).sort({ createdAt: -1 });

    if (!verifyUserBooking) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Your not allowed to give review!');
    }

    const verifyIfReviewExists = await Review.findOne(
        { user: payload?.user, car: payload?.car },
        { _id: 1 }
    );

    if (verifyIfReviewExists) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'You have already given your opinion!');
    }

    const review = await Review.create(payload);
    return review;
};

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
    const reviewModelQuey = new QueryBuilder(Review, query).filter();
    const result = await reviewModelQuey.ModelQuery;
    return result;
};

const updateReviewInToDB = async (id: string, payload: Partial<TReview>, userId: string) => {
    const review = await Review.findOne({ _id: id, user: userId });

    if (!review) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'You are not allowed to give review!');
    }

    const limitedField = { ...payload };
    delete limitedField?.car;
    delete limitedField?.user;

    const result = await Review.findByIdAndUpdate(id, limitedField, { new: true });
    return result;
};
const deleteReviewInToDB = async (id: string) => {
    const result = await Review.findByIdAndDelete(id);
    return result;
};

export const ReviewServices = {
    createReviewInToDB,
    getAllReviewsFromDB,
    updateReviewInToDB,
    deleteReviewInToDB,
};
