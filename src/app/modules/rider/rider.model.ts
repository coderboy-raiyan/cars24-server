import { model, Schema } from 'mongoose';
import { TRider } from './rider.interface';

const riderSchema = new Schema<TRider>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    nidNumber: {
        type: String,
        default: null,
    },
    passportNumber: {
        type: String,
        default: null,
    },
    drivingLicenseNumber: {
        type: String,
        default: null,
    },
    user: {
        type: String,
        ref: 'User',
        required: true,
    },
    address: {
        type: String,
        default: null,
    },
    contactNo: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        default: null,
    },
});

const Rider = model<TRider>('Rider', riderSchema);

export default Rider;
