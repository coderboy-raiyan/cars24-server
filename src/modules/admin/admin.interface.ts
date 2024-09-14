import { Types } from 'mongoose';

export type TAdmin = {
    name: string;
    email: string;
    contactNo: string;
    user: Types.ObjectId | string;
    profileImg?: string;
    address: string;
};
