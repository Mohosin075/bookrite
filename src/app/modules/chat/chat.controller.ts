import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { ChatService } from './chat.service';


const getMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;

    const result = await ChatService.getMessagesByRoomIdFromDB(roomId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Messages retrieved successfully.',
      data: result,
    });
  }
);

export const ChatController = {
  getMessages,
};
