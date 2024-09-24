import { config } from '../config';
import { UserConstants } from '../modules/user/user.constant';
import User from '../modules/user/user.model';

export const superAdminData = {
    email: 'tajkierhaque@gmail.com',
    name: 'Tajkier Haque Raiyan',
    user: {
        email: 'tajkierhaque@gmail.com',
        role: 'superAdmin',
    },
    address: 'Dhaka',
    contactNo: '01865895441',
    profileImg: '',
};

const superUser = {
    email: 'tajkierhaque@gamil.com',
    password: config.SUPER_ADMIN_PASSWORD,
    role: UserConstants.UserRoles.superAdmin,
};

async function seedSuperUser() {
    const isSuperUserExists = await User.findOne({ role: UserConstants.UserRoles.superAdmin });

    if (!isSuperUserExists) {
        await User.create(superUser);
    }
}

export default seedSuperUser;
