import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserConstants } from '../user/user.constant';
import { ReviewControllers } from './review.controller';
import { ReviewValidations } from './review.validation';

const ReviewRoutes = Router();
const { admin, superAdmin, rider } = UserConstants.UserRoles;

ReviewRoutes.post(
    '/',
    auth(admin, superAdmin, rider),
    validateRequest(ReviewValidations.createReviewValidationSchema),
    ReviewControllers.createReview
);
ReviewRoutes.get('/', auth(admin, superAdmin), ReviewControllers.getAllReviews);
ReviewRoutes.patch(
    '/:id',
    auth(admin, superAdmin, rider),
    validateRequest(ReviewValidations.updateReviewValidationSchema),
    ReviewControllers.updateReviews
);
ReviewRoutes.delete('/:id', auth(admin, superAdmin, rider), ReviewControllers.deleteReviews);

export default ReviewRoutes;
