import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBanner } from './banner.interface';
import { Banner } from './banner.model';

// create Banner
const createBannerToDB = async (data: IBanner) => {
  const isExist = await Banner.findOne({ name: data.name });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Banner Already exist!');
  }

  const createdBanner = await Banner.create(data);
  return createdBanner;
};

// get categorries
const getBannerFromDB = async () => {
  const categories = await Banner.find();
  return categories;
};

// update Banner
const updateBannerFromDB = async (id: string, payload: Partial<IBanner>) => {
  const isExistBanner = await Banner.findById(id);
  if (!isExistBanner) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Banner doesnt exist!');
  }

  const updateBanner = await Banner.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updateBanner;
};

// delete Banner
const deleteBannerFromDB = async (id: string) => {
  const isExistBanner = await Banner.findById(id);
  if (!isExistBanner) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Banner doesnt exist!');
  }

  return await Banner.findByIdAndDelete(id);
};

export const BannerServices = {
  createBannerToDB,
  getBannerFromDB,
  updateBannerFromDB,
  deleteBannerFromDB,
};
