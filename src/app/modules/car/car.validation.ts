import { z } from 'zod';
import { CarConstants } from './car.constant';

const createCarValidationSchema = z.object({
    name: z.string().max(60),
    carType: z.enum(CarConstants.CarTypeEnum as [string, ...string[]]),
    color: z.string(),
    description: z.string(),
    features: z.array(z.string()),
    isElectric: z.boolean(),
    pricePerHour: z.number(),
    status: z.enum(CarConstants.CarStatusEnum as [string, ...string[]]).optional(),
});

export const CarValidations = {
    createCarValidationSchema,
};
