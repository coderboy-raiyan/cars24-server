import { Types } from 'mongoose';

export type TRider = {
    name: string;
    email: string;
    user: string | Types.ObjectId;
    contactNo: string;
    address: string;
    profileImg?: string;
    nidNumber: string;
    passportNumber: string;
    drivingLicenseNumber: string;
};
