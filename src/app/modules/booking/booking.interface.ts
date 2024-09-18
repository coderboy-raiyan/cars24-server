import { Types } from 'mongoose';

export type TBooking = {
    date: string;
    user: string | Types.ObjectId;
    car: string | Types.ObjectId;
    startTime: string;
    endTime: string;
    totalCoast: number;
};
