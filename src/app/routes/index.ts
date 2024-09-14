import { Router } from 'express';
import AuthRoutes from '../modules/auth/auth.route';

const router = Router();

const routes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
