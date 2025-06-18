import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IService } from './services.interface';
import { Service } from './services.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createServiceFromDB = async (data: IService) => {
  return await Service.create(data);
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

const getServicesByCategoryFromDB = async (id: string) => {
  const isExistServices = await Service.find({ category: id }).populate('category').populate('provider');

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

  return await Service.findByIdAndUpdate(id, payload, { new: true });
};

const deleteServiceFromDB = async (id: string) => {
  const isExistServices = await Service.findById(id);
  if (!isExistServices) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service doesnt exist!');
  }

  return await Service.findByIdAndDelete(id);
};

export const ServiceServices = {
  createServiceFromDB,
  getServicesFromDB,
  getServicesByCategoryFromDB,
  getSingleServiceFromDB,
  updateServiceFromDB,
  deleteServiceFromDB,
};
