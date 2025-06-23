import { Model } from 'mongoose';

export interface IChat {
  roomId: string;
  sender: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ChatModel = Model<IChat>;
