import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookingControllers } from './booking.controller';
import { BookingValidations } from './booking.validation';

const BookingRoutes = Router();

BookingRoutes.post(
    '/',
    validateRequest(BookingValidations.createBookingValidationSchema),
    BookingControllers.createBooking
);

export default BookingRoutes;
