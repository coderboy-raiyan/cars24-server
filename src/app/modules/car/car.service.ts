import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { deleteFromCloudinary, uploadToCloudinary } from '../../utils/cloudinary';
import slugGenerator from '../../utils/slugGenerator';
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

export const CarServices = {
    createCarInToDB,
};
