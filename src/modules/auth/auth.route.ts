import { Router } from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import { AdminControllers } from '../admin/admin.controller';
import { AdminValidations } from '../admin/admin.validation';
import { RiderControllers } from '../rider/rider.controller';
import { RiderValidations } from '../rider/rider.validation';
import { AuthControllers } from './auth.controller';
import { AuthValidations } from './auth.validation';

const AuthRoutes = Router();

AuthRoutes.post(
    '/register-rider',
    validateRequest(RiderValidations.createRiderValidationSchema),
    RiderControllers.register
);
AuthRoutes.post(
    '/register-admin',
    validateRequest(AdminValidations.createAdminValidationSchema),
    AdminControllers.register
);
AuthRoutes.post(
    '/login',
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.login
);

export default AuthRoutes;
