import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserConstants } from '../user/user.constant';
import { BookingControllers } from './booking.controller';
import { BookingValidations } from './booking.validation';

const BookingRoutes = Router();
const { admin, rider, superAdmin } = UserConstants.UserRoles;

BookingRoutes.post(
    '/',
    validateRequest(BookingValidations.createBookingValidationSchema),
    BookingControllers.createBooking
);
BookingRoutes.get('/upcoming/:id', BookingControllers.getUsersUpcomingBookings);
BookingRoutes.get('/', BookingControllers.getAllBookings);
BookingRoutes.patch(
    '/:id',
    auth(admin, rider, superAdmin),
    validateRequest(BookingValidations.updateBookingValidationSchema),
    BookingControllers.updateBookings
);
BookingRoutes.delete('/:id', auth(admin, superAdmin), BookingControllers.deleteBookings);

export default BookingRoutes;
