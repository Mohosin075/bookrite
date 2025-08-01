import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPortfolio, IService } from './services.interface';
import { Portfolio, Service } from './services.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import Stripe from 'stripe';
import Booking from '../booking/booking.model';
import unlinkFile from '../../../shared/unlinkFile';

const createServiceFromDB = async (data: IService) => {
  const result = await Service.create(data);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service creation failed!');
  }
  return result;
};

const getServicesFromDB = async (query: Record<string, any>) => {
  const baseQuery = Service.find({});

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(['name', 'description'])
    .filter()
    .sort()
    .fields()
    .paginate()
    .populate(['category', 'provider'], {});

  const products = await queryBuilder.modelQuery;

  const meta = await queryBuilder.getPaginationInfo();

  return {
    meta,
    data: products,
  };
};
const getServicesByProviderFromDB = async (
  userId: string,
  query: Record<string, any>,
): Promise<{
  meta: any;
  data: IService[];
}> => {
  const baseQuery = Service.find({ provider: userId });

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(['name', 'description'])
    .filter()
    .sort()
    .fields()
    .paginate()
    .populate(['category', 'provider'], {});

  const products = await queryBuilder.modelQuery;

  const meta = await queryBuilder.getPaginationInfo();

  return {
    meta,
    data: products,
  };
};

const getServicesByCategoryFromDB = async (id: string) => {
  const isExistServices = await Service.find({ category: id })
    .populate('category')
    .populate('provider');

  if (isExistServices.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service doesnt exist!');
  }

  return isExistServices;
};

const getSingleServiceFromDB = async (id: string) => {
  const isExistServices = await Service.findById(id);
  if (!isExistServices) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service doesnt exist!');
  }

  return isExistServices;
};

const updateServiceFromDB = async (id: string, payload: Partial<IService>) => {
  const isExistServices = await Service.findById(id);
  if (!isExistServices) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service doesnt exist!');
  }

  const result = await Service.findByIdAndUpdate(id, payload, { new: true });

  if(payload.image && result?.image && payload.image !== isExistServices.image) {
    unlinkFile(isExistServices.image);
  }

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service update failed!');
  }
  return result;
};

const deleteServiceFromDB = async (id: string) => {
  const isExistServices = await Service.findById(id);
  if (!isExistServices) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service doesnt exist!');
  }

  return await Service.findByIdAndDelete(id);
};

// for portfolio

// Create a portfolio
const createPortfolioFromDB = async (data: IPortfolio, user: JwtPayload) => {
  return await Portfolio.create({ ...data, provider: user.id });
};

const getPortfoliosByProviderFromDB = async (provider: string) => {
  const providerObjectId = new Types.ObjectId(provider);
  const isExistPortfolios = await Portfolio.find({
    provider: providerObjectId,
  }).populate('provider');

  if (isExistPortfolios.length === 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'No portfolios found for the provided service!',
    );
  }

  return isExistPortfolios;
};

// Get a single portfolio by ID
const getSinglePortfolioFromDB = async (id: string) => {
  const portfolio = await Portfolio.findById(id).populate('provider');
  if (!portfolio) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Portfolio doesn't exist!");
  }

  return portfolio;
};

// Update a portfolio by ID
const updatePortfolioFromDB = async (
  id: string,
  payload: Partial<IPortfolio>,
) => {
  const portfolio = await Portfolio.findById(id);
  if (!portfolio) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Portfolio doesn't exist!");
  }

  return await Portfolio.findByIdAndUpdate(id, payload, { new: true });
};

// Delete a portfolio by ID
const deletePortfolioFromDB = async (id: string) => {
  const portfolio = await Portfolio.findById(id);
  if (!portfolio) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Portfolio doesn't exist!");
  }

  return await Portfolio.findByIdAndDelete(id);
};

const markRecommendedServices = async () => {
  const ratingThreshold = 4.5;
  const reviewCountThreshold = 10;

  const recommendedServices = await Service.find({
    rating: { $gte: ratingThreshold },
    reviewsCount: { $gte: reviewCountThreshold },
  });

  const result = await Service.updateMany(
    { _id: { $in: recommendedServices.map(service => service._id) } },
    { $set: { isRecommended: true } },
  );

  return result;
};

const markTrendingServices = async () => {
  const bookingThreshold = 2;
  const daysThreshold = 30;

  const dateThreshold = new Date(
    Date.now() - daysThreshold * 24 * 60 * 60 * 1000,
  );

  // Step 1: Reset all services to not trending
  await Service.updateMany({}, { $set: { isTrending: false } });

  const trendingServices = await Service.aggregate([
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'service',
        as: 'bookings',
      },
    },
    {
      $unwind: {
        path: '$bookings',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        'bookings.date': { $gte: dateThreshold },
      },
    },
    {
      $group: {
        _id: '$_id',
        bookingCount: { $sum: 1 },
      },
    },
    {
      $match: {
        bookingCount: { $gte: bookingThreshold },
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ]);

  const servicesToUpdate = trendingServices.map(service => service._id);

  const result = await Service.updateMany(
    { _id: { $in: servicesToUpdate } },
    { $set: { isTrending: true } },
  );

  return result;
};

export default markTrendingServices;

const getRecommendedServicesFromDB = async (limit: number = 10) => {
  return await Service.find({ isRecommended: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const getTrendingServicesFromDB = async (limit: number = 10) => {
  return await Service.find({ isTrending: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const ServiceServices = {
  createServiceFromDB,
  getServicesFromDB,
  getServicesByCategoryFromDB,
  getSingleServiceFromDB,
  updateServiceFromDB,
  deleteServiceFromDB,

  createPortfolioFromDB,
  getPortfoliosByProviderFromDB,
  getSinglePortfolioFromDB,
  updatePortfolioFromDB,
  deletePortfolioFromDB,

  markRecommendedServices,
  markTrendingServices,

  getRecommendedServicesFromDB,
  getTrendingServicesFromDB,
  getServicesByProviderFromDB,
};
