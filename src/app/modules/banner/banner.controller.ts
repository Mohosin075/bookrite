import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import { BannerServices } from './banner.service';

const createBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let image = getSingleFilePath(req.files, 'image');
    const data = { ...req.body, image };

    const result = await BannerServices.createBannerToDB(data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Banner created successfully.',
      data: result,
    });
  },
);

const getBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await BannerServices.getBannerFromDB();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Banner data retrieved successfully',
      data: result,
    });
  },
);

const updateBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let image = getSingleFilePath(req.files, 'image');
    const data = { ...req.body, image };

    const { id } = req.params;
    const result = await BannerServices.updateBannerFromDB(id, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Banner data updated successfully',
      data: result,
    });
  },
);

const deleeteBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await BannerServices.deleteBannerFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Banner data deleted successfully',
      data: result,
    });
  },
);

export const BannerController = {
  createBanner,
  getBanner,
  updateBanner,
  deleeteBanner,
};
