import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { deleteFromCloudinary, uploadToCloudinary } from '../../utils/cloudinary';
import slugGenerator from '../../utils/slugGenerator';
import { BookingConstants } from '../booking/booking.constant';
import Booking from '../booking/booking.model';
import { CarConstants } from './car.constant';
import { TCar, TCarImages } from './car.interface';
import Car from './car.model';

const createCarInToDB = async (payload: TCar, files: Express.Multer.File[]) => {
    const isCarExists = await Car.findOne({ name: payload?.name });

    if (isCarExists) {
        throw new AppError(StatusCodes.BAD_REQUEST, `${isCarExists?.name} already exists!`);
    }

    const cloudinaryImages: TCarImages[] = [];

    try {
        for (const file of files) {
            const img = await uploadToCloudinary(file?.path);
            cloudinaryImages.push(img);
        }
        const slug = slugGenerator(payload?.name);
        payload.slug = slug;
        payload.images = cloudinaryImages;

        const car = await Car.create(payload);
        return car;
    } catch (error) {
        for (const uploadedImg of cloudinaryImages) {
            await deleteFromCloudinary(uploadedImg?.public_id);
        }
        throw new Error(error);
    }
};

const getAllCarsFromDB = async (query: Record<string, unknown>) => {
    const CarModelQuery = new QueryBuilder(Car, query)
        .search(CarConstants.CarSearchFields)
        .filter()
        .paginate()
        .sort()
        .fields();
    const result = await CarModelQuery.ModelQuery;
    return result;
};

const getSingleCarsFromDB = async (id: string) => {
    const result = await Car.findById(id);
    return result;
};

const updateCarIntoDB = async (
    id: string,
    payload: Partial<TCar> & { deleteImages: TCarImages[] },
    files?: Express.Multer.File[]
) => {
    const { color, features, deleteImages, ...restObj } = payload;

    let car = await Car.findById(id);

    if (!car) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Oops! car not found');
    }

    if (car.isDeleted) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Car has been deleted!');
    }

    // delete selected images
    if (deleteImages && deleteImages.length) {
        car = await Car.findByIdAndUpdate(
            id,
            {
                $pullAll: {
                    images: deleteImages,
                },
            },
            { new: true }
        );

        for (const img of deleteImages) {
            await deleteFromCloudinary(img?.public_id);
        }
    }

    // upload new images and update database
    if (files && files?.length) {
        const cloudinaryImages: TCarImages[] = [];

        try {
            for (const file of files) {
                const img = await uploadToCloudinary(file?.path);
                cloudinaryImages.push(img);
            }
        } catch (error) {
            for (const uploadedImg of cloudinaryImages) {
                await deleteFromCloudinary(uploadedImg?.public_id);
            }
            throw new Error(error);
        }
        car = await Car.findByIdAndUpdate(
            id,
            {
                $push: {
                    images: {
                        $each: cloudinaryImages,
                    },
                },
            },
            { new: true }
        );
    }

    // update features
    if (features && features.length) {
        const deletedFeatures = car?.features.filter((feature) => !features.includes(feature));
        const updatedFeatures = features?.filter((feature) => !car?.features?.includes(feature));

        if (deletedFeatures?.length) {
            car = await Car.findByIdAndUpdate(
                id,
                {
                    $pullAll: {
                        features: deletedFeatures,
                    },
                },
                { new: true }
            );
        }

        if (updatedFeatures?.length) {
            car = await Car.findByIdAndUpdate(
                id,
                {
                    $push: {
                        features: {
                            $each: updatedFeatures,
                        },
                    },
                },
                { new: true }
            );
        }
    }
    // update colors
    if (color && color.length) {
        const deletedColors = car?.color.filter((feature) => !color.includes(feature));
        const updatedColors = color?.filter((feature) => !car?.color?.includes(feature));

        if (deletedColors?.length) {
            car = await Car.findByIdAndUpdate(
                id,
                {
                    $pullAll: {
                        color: deletedColors,
                    },
                },
                { new: true }
            );
        }

        if (updatedColors?.length) {
            car = await Car.findByIdAndUpdate(
                id,
                {
                    $push: {
                        color: {
                            $each: updatedColors,
                        },
                    },
                },
                { new: true }
            );
        }
    }

    if (restObj?.slug && !restObj?.name) {
        restObj.slug = car?.slug;
    }
    if (restObj?.name) {
        const slug = slugGenerator(payload?.name);
        restObj.slug = slug;
    }

    car = await Car.findByIdAndUpdate(id, restObj, { new: true });

    return car;
};

const deleteCarFromDB = async (id: string) => {
    const result = await Car.findByIdAndUpdate(
        id,
        { isDeleted: true, status: CarConstants.CarStatus.unavailable },
        { new: true }
    );

    try {
        for (const uploadedImg of result.images) {
            await deleteFromCloudinary(uploadedImg?.public_id);
        }
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const returnCar = async (payload: { bookingId: string; endTime: string }) => {
    const booking = await Booking.findById(payload?.bookingId);

    if (!booking) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Booking not found!');
    }

    if (!booking?.isApproved) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Booking is not approved yet!');
    }

    switch (booking?.status) {
        case BookingConstants.BookingStatus.completed:
            throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Can't return completed booking!");
        case BookingConstants.BookingStatus.approved:
            throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Can't return approved booking!");
        case BookingConstants.BookingStatus.canceled:
            throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Can't return canceled booking!");

        default:
            break;
    }

    const car = await Car.findById(booking.car);

    if (!car) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Car not found!');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const updatedBooking = await Booking.findByIdAndUpdate(
            booking?._id,
            { status: BookingConstants.BookingStatus.completed },
            { new: true, session }
        );

        if (!updatedBooking) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update booking!');
        }
        const updatedCar = await Car.findByIdAndUpdate(
            car?._id,
            { status: CarConstants.CarStatus.available },
            { new: true, session }
        );

        if (!updatedCar) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update car!');
        }
        await session.commitTransaction();
        await session.endSession();

        return {
            booking: updatedBooking,
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error);
    }
};

export const CarServices = {
    createCarInToDB,
    getAllCarsFromDB,
    updateCarIntoDB,
    getSingleCarsFromDB,
    deleteCarFromDB,
    returnCar,
};
