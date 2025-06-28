import { FilterQuery } from 'mongoose';
import { Message } from '../message/message.model';
import { IChat } from './chat.interface';
import { Chat } from './chat.model';
import { JwtPayload } from 'jsonwebtoken';

const createChatToDB = async (payload: IChat): Promise<IChat> => {

    const isExistChat: IChat | null = await Chat.findOne({
        participants: { $all: payload },
    });

    if (isExistChat) {
        return isExistChat;
    }
    const chat: IChat = await Chat.create({ participants: payload });
    return chat;
}

const getChatFromDB = async (user: JwtPayload, search: string): Promise<IChat[]> => {

    const query: FilterQuery<IChat> = {
        participants: { $in: [user.id] },
    };

    // Populate only the matched participants
    const chats = await Chat.find({ participants: { $in: [user.id] } })
        .populate({
            path: 'participants',
            select: '_id name profile',
            match: { _id: { $ne: user.id } }
        })
        .select('participants status')
        .lean();

    // Remove chats where participants array is empty after filtering
    const filteredChats = chats.filter(chat => chat.participants.length > 0);

    // Get all last messages in a single query
    const chatIds = filteredChats.map(chat => chat._id);
    const lastMessages = await Message.find({ chatId: { $in: chatIds } })
        .sort({ createdAt: -1 })
        .select('text offer createdAt sender chatId')
        .lean();

    // Map last messages to their respective chats
    const lastMessageMap = new Map(lastMessages.map(msg => [msg.chatId.toString(), msg]));

    // Merge last messages with chat data
    return filteredChats.map(chat => ({
        ...chat,
        lastMessage: lastMessageMap.get(chat._id.toString()) || null,
    }));
};

export const ChatService = { createChatToDB, getChatFromDB };