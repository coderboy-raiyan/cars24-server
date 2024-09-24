import { superAdminData } from '../../DB';
import Admin from '../admin/admin.model';
import Rider from '../rider/rider.model';
import { TUserRole } from './user.interface';

const getMe = async (userId: string, role: TUserRole) => {
    let result = null;

    switch (role) {
        case 'admin':
            result = await Admin.findOne({ user: userId }).populate('user');
            break;
        case 'rider':
            result = await Rider.findOne({ user: userId }).populate('user');
            break;
        case 'superAdmin':
            result = superAdminData;
            break;

        default:
            break;
    }

    return result;
};

export const UserServices = {
    getMe,
};
