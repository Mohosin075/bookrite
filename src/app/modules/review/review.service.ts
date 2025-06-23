import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Service } from '../services/services.model';
import { Review } from './review.model';
import { IReview } from './review.interface';

const addReviewToService = async (userId: string, data: Partial<IReview>) => {
  const { service, reviewText, rating } = data;
  const serviceById = await Service.findById(service);

  if (!serviceById) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found!');
  }

  const newReview = new Review({
    user: userId,
    service,
    rating,
    reviewText,
  });

  await newReview.save();

  const updatedService = await Service.aggregate([
    { $match: { _id: service } },
    {
      $addFields: {
        reviews: { $concatArrays: ['$reviews', [newReview._id]] },
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: 'reviews',
        foreignField: '_id',
        as: 'reviewDetails',
      },
    },
    {
      $addFields: {
        rating: {
          $avg: '$reviewDetails.rating',
        },
      },
    },
    { $project: { reviews: 1, rating: 1 } },
    { $merge: { into: 'services' } },
  ]);

  if (!updatedService) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Error updating the service with new review.'
    );
  }

  return newReview;
};






const getReviewsByService = async (serviceId: string) => {
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found!');
  }

  const reviews = await Review.find({ service: serviceId })
    .populate('user', 'name email') 
    .exec();

  if (!reviews.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No reviews found for this service!');
  }

  return reviews;
};



const updateReviewText = async (reviewId: string, userId: string, newReviewText: string) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found!');
  }

  review.reviewText = newReviewText;
  await review.save();

  return review;
}; 

export const ReviewServices = {
  addReviewToService,
  getReviewsByService,
  updateReviewText
};
