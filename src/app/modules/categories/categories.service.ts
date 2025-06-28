import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICategory } from './categories.interface';
import { Category } from './categories.model';

// create category
const createCategoryToDB = async (data: ICategory) => {
  const isExist = await Category.findOne({ name: data.name });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category Already exist!');
  }

  const createdCategory = await Category.create(data);
  return createdCategory;
};

// get categorries
const getCategoriesFromDB = async () => {
  const categories = await Category.find();
  return categories;
};

// get single category
const getSingleCategoryFromDB = async (id: string) => {
  const isExistCategory = await Category.findById(id);
  if (!isExistCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category doesnt exist!');
  }

  return isExistCategory;
};

// update category
const updateCategoryFromDB = async (
  id: string,
  payload: Partial<ICategory>,
) => {
  const isExistCategory = await Category.findById(id);
  if (!isExistCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category doesnt exist!');
  }

  const updateCategory = await Category.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updateCategory;
};

// delete category
const deleteCategoryFromDB = async (id: string) => {
  const isExistCategory = await Category.findById(id);
  if (!isExistCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category doesnt exist!');
  }

  return await Category.findByIdAndDelete(id);
};

export const CategoryServices = {
  createCategoryToDB,
  getCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryFromDB,
  deleteCategoryFromDB,
};
