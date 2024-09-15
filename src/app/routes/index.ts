import { Router } from 'express';
import AuthRoutes from '../modules/auth/auth.route';
import CarRoutes from '../modules/car/car.route';

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
];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
