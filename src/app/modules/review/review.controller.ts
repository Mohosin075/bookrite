import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ReviewServices } from './review.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';

const addReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...data } = req.body;
    const userId = req.user.id;

    try {
      const newReview = await ReviewServices.addReviewToService(
        userId,
        data
      );
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Review added successfully.',
        data: newReview,
      });
    } catch (error) {
      next(error);
    }
  }
);




const getReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { serviceId } = req.params;

    try {
      const reviews = await ReviewServices.getReviewsByService(serviceId);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Reviews retrieved successfully.',
        data: reviews,
      });
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  }
);



const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params;
    const { reviewText } = req.body;
    const userId = req.user._id;

    try {
      const updatedReview = await ReviewServices.updateReviewText(reviewId, userId, reviewText);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Review updated successfully.',
        data: updatedReview,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const ServiceReviewController = {
  addReview,
  getReviews,
  updateReview
};
