import { TBookingStatusEnum, TPaymentStatusEnum } from './booking.interface';

const BookingStatus = {
    completed: 'completed',
    pending: 'pending',
    approved: 'approved',
    canceled: 'canceled',
} as const;
const PaymentStatus = {
    completed: 'completed',
    pending: 'pending',
    canceled: 'canceled',
} as const;

const BookingStatusEnum: TBookingStatusEnum = ['completed', 'pending', 'approved', 'canceled'];
const PaymentStatusEnum: TPaymentStatusEnum = ['completed', 'pending', 'canceled'];

export const BookingConstants = {
    BookingStatus,
    PaymentStatus,
    PaymentStatusEnum,
    BookingStatusEnum,
};
