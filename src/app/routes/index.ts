import { Router } from 'express';
import AuthRoutes from '../modules/auth/auth.route';
import BookingRoutes from '../modules/booking/booking.route';
import CarRoutes from '../modules/car/car.route';
import ReviewRoutes from '../modules/review/review.route';
import UserRoutes from '../modules/user/user.route';

const router = Router();

const routes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/cars',
        route: CarRoutes,
    },
    {
        path: '/bookings',
        route: BookingRoutes,
    },
    {
        path: '/reviews',
        route: ReviewRoutes,
    },
    {
        path: '/users',
        route: UserRoutes,
    },
];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
