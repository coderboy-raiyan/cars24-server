import { model, Schema } from 'mongoose';
import { CarConstants } from './car.constant';
import { TCar } from './car.interface';

const carSchema = new Schema<TCar>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    carType: {
        type: String,
        enum: CarConstants.CarTypeEnum,
        required: true,
    },
    color: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
    description: {
        type: String,
        required: true,
        trim: true,
    },
    features: [
        {
            type: String,
            required: true,
        },
    ],
    images: [],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isElectric: {
        type: Boolean,
        required: true,
    },
    pricePerHour: {
        type: Number,
        min: 0,
        required: true,
    },
    status: {
        type: String,
        enum: CarConstants.CarStatusEnum,
        default: 'available',
    },
});

const Car = model<TCar>('Car', carSchema);

export default Car;
