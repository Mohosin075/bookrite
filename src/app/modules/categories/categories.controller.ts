import { NextFunction, Request, Response } from 'express';
import { CategoryServices } from './categories.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let image = getSingleFilePath(req.files, 'image');
    const data = { ...req.body, image };

    const result = await CategoryServices.createCategoryToDB(data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category created successfully.',
      data: result,
    });
  },
);

const getCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CategoryServices.getCategoriesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category data retrieved successfully',
      data: result,
    });
  },
);

const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await CategoryServices.getSingleCategoryFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category data retrieved successfully',
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { ...data } = req.body;

    const result = await CategoryServices.updateCategoryFromDB(id, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category data updated successfully',
      data: result,
    });
  },
);

const deleeteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await CategoryServices.deleteCategoryFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category data deleted successfully',
      data: result,
    });
  },
);

export const CategoryController = {
  createCategory,
  getCategory,
  getSingleCategory,
  updateCategory,
  deleeteCategory,
};
