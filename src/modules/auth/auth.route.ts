import { Router } from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import { RiderControllers } from '../rider/rider.controller';
import { RiderValidations } from '../rider/rider.validation';

const AuthRoutes = Router();

AuthRoutes.post(
    '/register-rider',
    validateRequest(RiderValidations.createRiderValidationSchema),
    RiderControllers.register
);

export default AuthRoutes;
