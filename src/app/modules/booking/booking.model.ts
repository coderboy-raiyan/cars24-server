import { model, Schema } from 'mongoose';
import { BookingConstants } from './booking.constant';
import { TBooking } from './booking.interface';

const bookingSchema = new Schema<TBooking>(
    {
        date: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: BookingConstants.BookingStatusEnum,
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: BookingConstants.PaymentStatusEnum,
            default: 'pending',
        },
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
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
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Booking = model<TBooking>('Booking', bookingSchema);

export default Booking;
