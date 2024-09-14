import { TUserRoleEnum, TUserRoles } from './user.interface';

const UserRoles: TUserRoles = {
    admin: 'admin',
    rider: 'rider',
    superAdmin: 'superAdmin',
};

const UserRoleEnums: TUserRoleEnum = ['admin', 'rider', 'superAdmin'];

export const UserConstants = {
    UserRoles,
    UserRoleEnums,
};
