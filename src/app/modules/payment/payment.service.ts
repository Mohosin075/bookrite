import Stripe from 'stripe';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const stripe = new Stripe(
  'sk_test_51RcvK8GdOsJASBMCyCHnUnQdC3o9ksQqIchDPKPZrpkxK24jtIeZlZSYPlH4e9tJ1bpYrFsSkvtRUbe3F3YDa7tQ00fwocVhTn' as string,
  {
    apiVersion: '2025-05-28.basil',
  }
);

const createStripePayment = async (data: IPayment) => {
  const { amount, currency, user, orderId, saveCard } = data;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: {
      userId: user.toString(),
      orderId: orderId?.toString() || '',
    },
  });

  const paymentRecord = await Payment.create({
    user,
    orderId,
    amount,
    currency,
    method: 'STRIPE',
    status: 'PENDING',
    transactionId: paymentIntent.id,
    saveCard,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    payment: paymentRecord,
  };
};

const confirmStripePayment = async (transactionId: string) => {
  const intent = await stripe.paymentIntents.retrieve(transactionId);

  if (intent.status !== 'succeeded') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment not completed.');
  }

  const updated = await Payment.findOneAndUpdate(
    { transactionId },
    { status: 'SUCCESS' },
    { new: true }
  );

  return updated;
};

export const PaymentService = {
  createStripePayment,
  confirmStripePayment,
};
