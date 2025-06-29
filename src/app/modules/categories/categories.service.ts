import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICategory } from './categories.interface';
import { Category } from './categories.model';
import unlinkFile from '../../../shared/unlinkFile';

// create category
const createCategoryToDB = async (data: ICategory) => {
  const isExist = await Category.findOne({ name: data.name });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category Already exist!');
  }

  const createdCategory = await Category.create(data);

  if (!createdCategory) {
    if (data.image) {
      unlinkFile(data.image);
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category creation failed!');
  }

  return createdCategory;
};

// get categorries
const getCategoriesFromDB = async () => {
  const categories = await Category.find()
    .select('-__v -createdAt -updatedAt')
    .sort({ createdAt: -1 });
  return categories;
};

// get single category
const getSingleCategoryFromDB = async (id: string) => {
  const isExistCategory = await Category.findById(id).select(
    '-__v -createdAt -updatedAt',
  );
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

  if (payload.image && isExistCategory.image) {
    unlinkFile(isExistCategory.image);
  }

  const updateCategory = await Category.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!updateCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category update failed!');
  }

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
