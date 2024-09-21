import { model, Schema } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>({
    description: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    ratings: {
        type: Number,
        max: 5,
        min: 0,
        required: true,
    },
});

const Review = model<TReview>('Review', reviewSchema);

export default Review;
