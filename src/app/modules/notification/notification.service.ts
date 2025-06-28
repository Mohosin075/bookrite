import { JwtPayload } from 'jsonwebtoken';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import { FilterQuery } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';

// get notifications
const getNotificationFromDB = async ( user: JwtPayload, query: FilterQuery<any> ): Promise<Object> => {
    const result = new QueryBuilder(Notification.find({ receiver: user.id }), query).paginate();
    const notifications = await result.modelQuery.exec();
    const pagination = await result.getPaginationInfo();

    const unreadCount = await Notification.countDocuments({
        receiver: user.id,
        read: false,
    });

    const data: Record<string ,any> = {
        notifications,
        pagination,
        unreadCount
    };

  return data;
};

// read notifications only for user
const readNotificationToDB = async ( user: JwtPayload): Promise<INotification | undefined> => {

    const result: any = await Notification.updateMany(
        { receiver: user.id, read: false },
        { $set: { read: true } }
    );
    return result;
};

// get notifications for admin
const adminNotificationFromDB = async (query: FilterQuery<any>): Promise<{notifications: INotification[], pagination: any}> => {

    const result = new QueryBuilder(Notification.find({ type: "ADMIN" }), query).paginate();
    const notifications = await result.modelQuery.exec();
    const pagination = await result.getPaginationInfo();
    return {notifications, pagination};
};

// read notifications only for admin
const adminReadNotificationToDB = async (): Promise<INotification | null> => {
    const result: any = await Notification.updateMany(
        { type: 'ADMIN', read: false },
        { $set: { read: true } },
        { new: true }
    );
    return result;
};

export const NotificationService = {
    adminNotificationFromDB,
    getNotificationFromDB,
    readNotificationToDB,
    adminReadNotificationToDB
};
