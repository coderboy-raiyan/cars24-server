import { TUserRoleEnum, TUserRoles } from './user.interface';

const UserRoles: TUserRoles = {
    admin: 'admin',
    rider: 'rider',
};

const UserRoleEnums: TUserRoleEnum = ['admin', 'rider'];

export const UserConstants = {
    UserRoles,
    UserRoleEnums,
};
