import { Types } from 'mongoose';

export type TRider = {
    name: string;
    email: string;
    user: string | Types.ObjectId;
    contactNo: string;
    address: string;
    profileImg?: string;
    nidNo: string;
    passportNo: string;
    drivingLicense: string;
};
