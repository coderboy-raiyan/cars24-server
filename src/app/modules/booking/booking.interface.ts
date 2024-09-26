import { Types } from 'mongoose';
import { BookingConstants } from './booking.constant';

export type TBookingStatusEnum = (keyof typeof BookingConstants.BookingStatus)[];
export type TPaymentStatusEnum = (keyof typeof BookingConstants.PaymentStatus)[];

export type TBooking = {
    date: string;
    user: string | Types.ObjectId;
    car: string | Types.ObjectId;
    status: keyof typeof BookingConstants.BookingStatus;
    startTime: string;
    endTime: string;
    totalCoast: number;
    isApproved: boolean;
    paymentStatus: keyof typeof BookingConstants.PaymentStatus;
};
