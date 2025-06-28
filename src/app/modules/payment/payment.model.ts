import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    method: {
      type: String,
      enum: ['CARD', 'CASH', 'BANK', 'STRIPE'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
    transactionId: { type: String },
    cardDetails: {
      cardHolderName: { type: String },
      last4: { type: String },
      brand: { type: String },
      expiryMonth: { type: Number },
      expiryYear: { type: Number },
    },

    saveCard: { type: Boolean, default: false },
  },
  { timestamps: true },
);

paymentSchema.index({ user: 1 });

export const Payment = model<IPayment>('Payment', paymentSchema);
