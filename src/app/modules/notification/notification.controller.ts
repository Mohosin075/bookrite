import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';

const getNotifications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    // const onlyUnread = req.query.unread === 'true';

    const result = await NotificationService.getNotificationsFromDB(
      userId,
      // onlyUnread
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notifications fetched successfully',
      data: result,
    });
  },
);

const markNotificationAsRead = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await NotificationService.markNotificationAsReadInDB(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notification marked as read',
      data: result,
    });
  },
);

export const NotificationController = {
  getNotifications,
  markNotificationAsRead,
};
