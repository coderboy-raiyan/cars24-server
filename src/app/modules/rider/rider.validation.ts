import { z } from 'zod';

const createRiderValidationSchema = z.object({
    body: z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
        name: z.string(),
        contactNo: z
            .string()
            .max(11, { message: 'Please enter a valid phone number with 11 digits.' }),
    }),
});

export const RiderValidations = {
    createRiderValidationSchema,
};
