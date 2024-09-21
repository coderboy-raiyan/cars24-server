import { z } from 'zod';
import { BookingValidations } from '../booking/booking.validation';
import { CarConstants } from './car.constant';

const createCarValidationSchema = z.object({
    name: z.string().max(60),
    carType: z.enum(CarConstants.CarTypeEnum as [string, ...string[]]),
    color: z.array(z.string()),
    description: z.string(),
    features: z.array(z.string()),
    isElectric: z.boolean(),
    pricePerHour: z.number(),
    status: z.enum(CarConstants.CarStatusEnum as [string, ...string[]]).optional(),
});

const updateCarValidationSchema = z.object({
    name: z.string().max(60).optional(),
    carType: z.enum(CarConstants.CarTypeEnum as [string, ...string[]]).optional(),
    color: z.array(z.string()).optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    isElectric: z.boolean().optional(),
    pricePerHour: z.number().optional(),
    status: z.enum(CarConstants.CarStatusEnum as [string, ...string[]]).optional(),
    deleteImages: z
        .array(
            z.object({
                public_id: z.string(),
                secure_url: z.string(),
                _id: z.string(),
            })
        )
        .optional(),
});

const returnCarValidationSchema = z.object({
    body: z.object({
        bookingId: z.string(),
        endTime: BookingValidations.timeValidationSchema,
    }),
});

export const CarValidations = {
    createCarValidationSchema,
    updateCarValidationSchema,
    returnCarValidationSchema,
};
