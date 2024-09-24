import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserConstants } from './user.constant';
import { UserControllers } from './user.controller';

const UserRoutes = Router();
const { admin, superAdmin, rider } = UserConstants.UserRoles;

UserRoutes.get('/me', auth(admin, superAdmin, rider), UserControllers.getMe);

export default UserRoutes;
