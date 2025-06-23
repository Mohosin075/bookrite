import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IChat } from './chat.interface';
import { Chat } from './chat.model';

// get messages by roomId
const getMessagesByRoomIdFromDB = async (roomId: string): Promise<IChat[]> => {
  const messages = await Chat.find({ roomId }).sort({ createdAt: 1 });
  if (!messages.length) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'No messages found for this room.'
    );
  }
  return messages;
};

export const ChatService = {
  getMessagesByRoomIdFromDB,
};
