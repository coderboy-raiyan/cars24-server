import { model, Schema } from 'mongoose';
import { CarConstants } from './car.constant';
import { TCar } from './car.interface';

const carSchema = new Schema<TCar>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        carType: {
            type: String,
            enum: CarConstants.CarTypeEnum,
            required: true,
        },
        slug: {
            type: String,
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
        images: [
            {
                secure_url: {
                    type: String,
                    required: true,
                },
                public_id: {
                    type: String,
                    required: true,
                },
            },
        ],
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
        review: {
            totalRating: {
                type: Number,
                default: 0,
            },
            avgRating: {
                type: Number,
                default: 0,
            },
        },
    },
    { timestamps: true }
);
// filter out deleted cars
carSchema.pre('find', function () {
    this.find({ isDeleted: { $ne: true } });
});

const Car = model<TCar>('Car', carSchema);

export default Car;
