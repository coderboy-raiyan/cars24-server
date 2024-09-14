import { TCarStatusEnum, TCarTypesEnum } from './car.interface';

const CarStatus = {
    available: 'available',
    unavailable: 'unavailable',
} as const;

const CarType = {
    suv: 'suv',
    hybrid: 'hybrid',
    sedan: 'sedan',
} as const;

const CarTypeEnum: TCarTypesEnum = ['suv', 'hybrid', 'sedan'];
const CarStatusEnum: TCarStatusEnum = ['available', 'unavailable'];

export const CarConstants = {
    CarStatus,
    CarType,
    CarTypeEnum,
    CarStatusEnum,
};
