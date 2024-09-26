import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AdminControllers } from '../admin/admin.controller';
import { AdminValidations } from '../admin/admin.validation';
import { RiderControllers } from '../rider/rider.controller';
import { RiderValidations } from '../rider/rider.validation';
import { UserConstants } from '../user/user.constant';
import { AuthControllers } from './auth.controller';
import { AuthValidations } from './auth.validation';

const AuthRoutes = Router();

const { superAdmin, admin } = UserConstants.UserRoles;

AuthRoutes.post(
    '/register-rider',
    validateRequest(RiderValidations.createRiderValidationSchema),
    RiderControllers.register
);
AuthRoutes.post(
    '/register-admin',
    auth(superAdmin, admin),
    validateRequest(AdminValidations.createAdminValidationSchema),
    AdminControllers.register
);
AuthRoutes.post(
    '/login',
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.login
);

export default AuthRoutes;
