import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [`${config?.NODE_ENV === 'development' ? '*' : config.CORS_ORIGIN_URL}`],
        credentials: true,
    })
);

app.get('/', (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json({ success: true, message: 'Server is healthy!' });
});

// all routes
app.use('/api/v1', router);

// not found error handler
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
