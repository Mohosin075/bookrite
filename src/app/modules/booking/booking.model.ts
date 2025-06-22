import mongoose, { Schema, Document } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema(
  {
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'completed', 'rejected', 'canceled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
