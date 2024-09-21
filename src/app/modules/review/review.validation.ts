import { z } from 'zod';

const createReviewValidationSchema = z.object({
    body: z.object({
        description: z.string(),
        user: z.string(),
        car: z.string(),
        ratings: z.number().min(0).max(5),
    }),
});
const updateReviewValidationSchema = z.object({
    body: z.object({
        description: z.string().optional(),
        ratings: z.number().min(0).max(5).optional(),
    }),
});

export const ReviewValidations = {
    createReviewValidationSchema,
    updateReviewValidationSchema,
};
