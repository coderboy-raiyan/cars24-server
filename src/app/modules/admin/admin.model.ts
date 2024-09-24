import { model, Schema } from 'mongoose';
import { TAdmin } from './admin.interface';

const adminSchema = new Schema<TAdmin>({
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
        ref: 'User',
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

const Admin = model<TAdmin>('Admin', adminSchema);

export default Admin;
