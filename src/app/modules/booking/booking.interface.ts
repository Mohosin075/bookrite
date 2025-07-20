import { Model, Types } from 'mongoose';

export type IBooking = {
  service: Types.ObjectId;
  user?: Types.ObjectId;

  date: Date;
  startTime: string;
  
  status: 'pending' | 'accepted' | 'completed' | 'rejected' | 'canceled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
}

export type BookingModel = Model<IBooking>;
