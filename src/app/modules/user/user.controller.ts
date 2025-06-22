import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  console.log('hit');
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

//accessLocation
const accessLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const data = {
      ...req.body,
    };
    const result = await UserService.accessLocationToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'access location data updated successfully',
      data: result,
    });
  }
);

const addBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { serviceId } = req.body;

    const result = await UserService.addBookmarkToDB(user.id, serviceId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Bookmark added successfully',
      data: result,
    });
  }
);

const removeBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { serviceId } = req.body;

    const result = await UserService.removeBookmarkFromDB(user.id, serviceId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Bookmark removed successfully',
      data: result,
    });
  }
);

const getBookmark = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    const result = await UserService.getBookmarkToDB(user.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Bookmark data retrived successfully',
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  accessLocation,
  addBookmark,
  removeBookmark,
  getBookmark,
};
