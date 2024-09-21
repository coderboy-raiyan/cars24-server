import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req, res) => {
    const result = await ReviewServices.createReviewInToDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Thanks for your kind response!',
        data: result,
    });
});
const getAllReviews = catchAsync(async (req, res) => {
    const result = await ReviewServices.getAllReviewsFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Reviews retrieved successfully!',
        data: result,
    });
});
const updateReviews = catchAsync(async (req, res) => {
    const result = await ReviewServices.updateReviewInToDB(
        req.params?.id,
        req.body,
        req?.user?._id
    );
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Reviews updated successfully!',
        data: result,
    });
});
const deleteReviews = catchAsync(async (req, res) => {
    const result = await ReviewServices.deleteReviewInToDB(req.params?.id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review deleted successfully!',
        data: result,
    });
});

export const ReviewControllers = {
    createReview,
    getAllReviews,
    updateReviews,
    deleteReviews,
};
