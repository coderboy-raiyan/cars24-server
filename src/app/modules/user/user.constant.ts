import { TUserRoleEnum } from './user.interface';

const UserRoles = {
    admin: 'admin',
    rider: 'rider',
    superAdmin: 'superAdmin',
} as const;

const UserRoleEnums: TUserRoleEnum = ['admin', 'rider', 'superAdmin'];

export const UserConstants = {
    UserRoles,
    UserRoleEnums,
};
