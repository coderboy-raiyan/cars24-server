import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import Booking from '../booking/booking.model';
import Car from '../car/car.model';
import { TReview } from './review.interface';
import Review from './review.model';

const createReviewInToDB = async (payload: TReview & { bookingId: string }) => {
    const car = await Car.findById(payload?.car);

    if (!car) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Car not found!');
    }

    const verifyUserBooking = await Booking.findOne(
        {
            _id: payload?.bookingId,
            user: payload?.user,
            car: payload?.car,
        },
        { _id: 1 }
    );

    if (!verifyUserBooking) {
        throw new AppError(
            StatusCodes.NOT_ACCEPTABLE,
            'Please ride this car before giving your opinion!'
        );
    }

    const verifyIfReviewExists = await Review.findOne(
        { user: payload?.user, car: payload?.car },
        { _id: 1 }
    );

    if (verifyIfReviewExists) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'You have already reviewed this car!');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        delete payload?.bookingId;
        const review = await Review.create([payload], { session });

        const countReviews = await Review.aggregate(
            [
                { $match: { car: car?._id } },
                {
                    $group: {
                        _id: null,
                        ratingsCount: { $avg: '$ratings' },
                        totalRatings: { $sum: 1 },
                    },
                },
            ],
            { session }
        );

        await Car.findByIdAndUpdate(
            car?._id,
            {
                'review.avgRating': countReviews[0]?.ratingsCount,
                'review.totalRating': countReviews[0]?.totalRatings,
            },
            { session }
        );

        await session.commitTransaction();
        await session.endSession();
        return review[0];
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw Error(error);
    }
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
