import { UserConstants } from './user.constant';

export type TUser = {
    email: string;
    password: string;
    role: keyof typeof UserConstants.UserRoles;
    isVerified: boolean;
    isDeleted: boolean;
};

export type TUserRoleEnum = (keyof typeof UserConstants.UserRoles)[];
