import { isValid, parse } from 'date-fns';
import { z } from 'zod';

const timeValidationSchema = z.string().refine((val) => {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(val);
});

const createBookingValidationSchema = z.object({
    body: z.object({
        date: z.string().refine((val) => {
            const parsedDate = parse(val, 'yyyy-MM-dd', new Date());
            return isValid(parsedDate);
        }),
        user: z.string(),
        car: z.string(),
        startTime: timeValidationSchema,
    }),
});
const updateBookingValidationSchema = z.object({
    body: z.object({
        date: z
            .string()
            .refine((val) => {
                const parsedDate = parse(val, 'yyyy-MM-dd', new Date());
                return isValid(parsedDate);
            })
            .optional(),
        car: z.string().optional(),
        startTime: timeValidationSchema.optional(),
    }),
});

export const BookingValidations = {
    createBookingValidationSchema,
    updateBookingValidationSchema,
    timeValidationSchema,
};
