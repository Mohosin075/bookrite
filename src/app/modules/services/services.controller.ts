import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ServiceServices } from './services.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createService = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  let image = getSingleFilePath(req.files, 'image');

  const data = {
    ...req.body,
    image,
    createdBy: userId,
  };

  const result = await ServiceServices.createServiceFromDB(data);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service created successfully.',
    data: result,
  });
});

const getServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.getServicesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service data retrieved successfully.',
    data: result,
  });
});

const getSingleServices = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ServiceServices.getSingleServiceFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service data retrieved successfully.',
    data: result,
  });
});

const getServiceByCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ServiceServices.getServicesByCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service data retrieved successfully.',
    data: result,
  });
});

const updateServices = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { ...data } = req.body;

  const result = await ServiceServices.updateServiceFromDB(id, data);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service data updated successfully.',
    data: result,
  });
});

const deleteServices = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ServiceServices.deleteServiceFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Service data deleted successfully.',
    data: result,
  });
});

// for portfolio

// Create a portfolio
const createPortfolio = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const user = req.user;

  let image = getSingleFilePath(req.files, 'image');
  const data = {
    ...req.body,
    image,
    createdBy: userId,
  };

  const result = await ServiceServices.createPortfolioFromDB(data, user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Portfolio created successfully.',
    data: result,
  });
});

// Get a single portfolio by ID
const getSinglePortfolio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ServiceServices.getSinglePortfolioFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Portfolio data retrieved successfully.',
    data: result,
  });
});

// Get portfolios by service ID
const getPortfoliosByProvider = catchAsync(
  async (req: Request, res: Response) => {
    const { provider } = req.body;

    const result = await ServiceServices.getPortfoliosByProviderFromDB(
      provider
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Portfolio data retrieved successfully.',
      data: result,
    });
  }
);

// Update a portfolio by ID
const updatePortfolio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  let image = getSingleFilePath(req.files, 'image');
  const data = { ...req.body, image };

  const result = await ServiceServices.updatePortfolioFromDB(id, data);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Portfolio data updated successfully.',
    data: result,
  });
});

// Delete a portfolio by ID
const deletePortfolio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ServiceServices.deletePortfolioFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Portfolio data deleted successfully.',
    data: result,
  });
});

const markRecommendedServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceServices.markRecommendedServices();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Services marked as recommended successfully.',
    data: result,
  });
});


export const serviceController = {
  createService,
  getServiceByCategory,
  getServices,
  getSingleServices,
  updateServices,
  deleteServices,
  createPortfolio,
  getPortfoliosByProvider,
  getSinglePortfolio,
  updatePortfolio,
  deletePortfolio,
  markRecommendedServices
};
