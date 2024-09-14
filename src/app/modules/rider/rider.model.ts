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
    user: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: '',
    },
    contactNo: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        default: '',
    },
});

const Rider = model<TRider>('Rider', riderSchema);

export default Rider;
