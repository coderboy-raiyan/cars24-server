import { Router } from 'express';
import fs from 'fs';
import upload from '../../middlewares/multer';
import catchAsync from '../../utils/catchAsync';
import { CarControllers } from './car.controller';
import { CarValidations } from './car.validation';

const CarRoutes = Router();

CarRoutes.post(
    '/create-car',
    upload.array('files', 5),
    catchAsync(async (req, res, next) => {
        try {
            req.body = await CarValidations.createCarValidationSchema.parseAsync(
                JSON.parse(req.body.data)
            );
        } catch (error) {
            for (const file of req.files as Express.Multer.File[]) {
                fs.unlink(file.path, (err) => {
                    if (err) {
                        next(err);
                    }
                });
            }
            throw new Error(error);
        }
        next();
    }),
    CarControllers.createCar
);

export default CarRoutes;
