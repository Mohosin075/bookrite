import mongoose, { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  role: USER_ROLES;
  contact: string;
  email: string;
  password: string;
  address: string;
  islocationGranted: boolean;
  image?: string;
  status: 'active' | 'delete';
  verified: boolean;
  bookmarks?: mongoose.Types.ObjectId[];
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  plan?: {
    type: string;
    expiresAt: Date;
  };
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
