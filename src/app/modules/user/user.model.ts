import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { config } from '../../config';
import { UserConstants } from './user.constant';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: UserConstants.UserRoleEnums,
        required: true,
    },
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, parseInt(config.BCRYPT_SALT_ROUNDS));
    }
    next();
});

const User = model<TUser>('User', userSchema);

export default User;
