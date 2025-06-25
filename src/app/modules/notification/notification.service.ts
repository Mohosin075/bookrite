import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';


const getNotificationsFromDB = async (userId: string, onlyUnread?: boolean) => {
  
  // if (onlyUnread) filter.isRead = false;

  const notifications = await Notification.find({to : new ObjectId(userId)}).sort({ createdAt: -1 }).limit(5);
  return notifications;
};

const markNotificationAsReadInDB = async (id: string) => {
  const exist = await Notification.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found!');
  }

  const updated = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
  return updated;
};

export const NotificationService = {
  getNotificationsFromDB,
  markNotificationAsReadInDB,
};
