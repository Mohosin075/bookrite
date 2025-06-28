import { Model, Types } from 'mongoose';

export type IChat = {
    _id?: Types.ObjectId;
    participants: [Types.ObjectId];
    status: Boolean;
}

export type ChatModel = Model<IChat, Record<string, unknown>>;