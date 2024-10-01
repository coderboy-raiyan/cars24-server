import { CarConstants } from './car.constant';

export type TCarStatus = keyof typeof CarConstants.CarStatus;
export type TCarTypes = keyof typeof CarConstants.CarType;
export type TCarTypesEnum = (keyof typeof CarConstants.CarType)[];
export type TCarStatusEnum = (keyof typeof CarConstants.CarStatus)[];

export type TCarImages = {
    secure_url: string;
    public_id: string;
};

export type TCar = {
    name: string;
    brand: string;
    carType: TCarTypes;
    images: TCarImages[];
    slug: string;
    description: string;
    color: string[];
    isElectric: boolean;
    status: TCarStatus;
    features: string[];
    pricePerHour: number;
    isDeleted: false;
    review: {
        totalRating: number;
        avgRating: number;
    };
};
