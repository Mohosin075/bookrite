import mongoose from 'mongoose';
import { IMessage } from './message.interface';
import { Message } from './message.model';
import { Chat } from '../chat/chat.model';
import { JwtPayload } from 'jsonwebtoken';
import { checkMongooseIDValidation } from '../../../shared/checkMongooseIDValidation';
import QueryBuilder from '../../builder/QueryBuilder';

const sendMessageToDB = async (payload: any): Promise<IMessage> => {

  // save to DB
  const response = await Message.create(payload);

  //@ts-ignore
  const io = global.io;
  if (io && payload.chatId) {
    // send message to specific chatId Room
    io.emit(`getMessage::${payload?.chatId}`, response);
  }

  return response;
};

const getMessageFromDB = async (id: string, user: JwtPayload, query: Record<string, any>): Promise<{ messages: IMessage[], pagination: any, participant:any  }> => {
  checkMongooseIDValidation(id, "Chat")

  const result = new QueryBuilder(
    Message.find({ chatId: id }).sort({ createdAt: 1 }),
    query
  ).paginate();
  const messages = await result.modelQuery.exec();
  const pagination = await result.getPaginationInfo();

  const participant = await Chat.findById(id).populate({
    path: 'participants',
    select: '-_id name profile',
    match: {
      _id: { $ne: new mongoose.Types.ObjectId(user.id) }
    }
  })

  return { messages, pagination, participant: participant?.participants[0] };
};

export const MessageService = { sendMessageToDB, getMessageFromDB };