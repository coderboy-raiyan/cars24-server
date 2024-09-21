import { Types } from 'mongoose';

export type TReview = {
    description: string;
    user: string | Types.ObjectId;
    car: string | Types.ObjectId;
    ratings: number;
};
