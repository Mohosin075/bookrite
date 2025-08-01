import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { Types } from 'mongoose';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  payload.islocationGranted = false;
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } },
  );

  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload,
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const accessLocationToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

// for bookmark

const getBookmarkToDB = async (userId: string): Promise<any> => {
  const user = await User.findById(userId).populate('bookmarks');

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return user.bookmarks;
};

const addBookmarkToDB = async (
  userId: string,
  serviceId: string,
): Promise<IUser> => {
  const serviceObjectId = new Types.ObjectId(serviceId);

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (user.bookmarks?.includes(serviceObjectId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Service already bookmarked');
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { bookmarks: serviceObjectId } },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to add bookmark');
  }

  return updatedUser;
};

const removeBookmarkFromDB = async (
  userId: string,
  serviceId: string,
): Promise<IUser> => {
  const serviceObjectId = new Types.ObjectId(serviceId);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { bookmarks: serviceObjectId } },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!updatedUser.bookmarks || updatedUser.bookmarks.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No bookmarks left');
  }

  return updatedUser;
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  accessLocationToDB,
  addBookmarkToDB,
  removeBookmarkFromDB,
  getBookmarkToDB,
};
