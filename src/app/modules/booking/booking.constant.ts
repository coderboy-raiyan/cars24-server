import { TBookingStatusEnum } from './booking.interface';

const BookingStatus = {
    completed: 'completed',
    pending: 'pending',
    approved: 'approved',
    canceled: 'canceled',
} as const;

const BookingStatusEnum: TBookingStatusEnum = ['completed', 'pending', 'approved', 'canceled'];

export const BookingConstants = {
    BookingStatus,
    BookingStatusEnum,
};
