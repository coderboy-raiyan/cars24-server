import { model, Schema } from 'mongoose';
import { TBooking } from './booking.interface';

const bookingSchema = new Schema<TBooking>(
    {
        date: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        car: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            default: null,
        },
        totalCoast: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Booking = model<TBooking>('Booking', bookingSchema);

export default Booking;
