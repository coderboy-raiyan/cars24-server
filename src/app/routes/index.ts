import { Router } from 'express';

const router = Router();

const routes = [];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
