import { z } from 'zod';

const createBookingValidationSchema = z.object({
    body: z.object({
        date: z.string().datetime(),
        user: z.string(),
        car: z.string(),
        startTime: z.string().refine((val) => {
            const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
            return timeRegex.test(val);
        }),
    }),
});

export const BookingValidations = {
    createBookingValidationSchema,
};
