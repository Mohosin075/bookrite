import { Model, Types } from 'mongoose';

export type IPayment = {
  user: Types.ObjectId;
  orderId?: Types.ObjectId;
  amount: number;
  currency: string;
  method: 'CARD' | 'CASH' | 'BANK' | 'STRIPE';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transactionId?: string;
  cardDetails?: {
    cardHolderName: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  saveCard?: boolean;
}

export type PaymentModel = Model<IPayment>;
