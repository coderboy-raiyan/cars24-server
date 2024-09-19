import { TBookingStatusEnum } from './booking.interface';

const BookingStatus = {
    done: 'done',
    pending: 'pending',
} as const;

const BookingStatusEnum: TBookingStatusEnum = ['done', 'pending'];

export const BookingConstants = {
    BookingStatus,
    BookingStatusEnum,
};
