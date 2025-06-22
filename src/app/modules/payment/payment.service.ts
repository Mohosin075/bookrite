import Stripe from 'stripe';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: '2025-05-28.basil',
});

const payWithStripeInOneGo = async (data: IPayment) => {
  const { amount, currency, user, orderId, saveCard, cardDetails } = data;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',
    },
    metadata: {
      userId: user.toString(),
      orderId: orderId?.toString() || '',
    },
  });

  const paymentMethod = `pm_card_${cardDetails?.brand.toLowerCase()}`;

  const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
    paymentIntent.id,
    {
      payment_method: paymentMethod,
    }
  );

  if (confirmedPaymentIntent.status !== 'succeeded') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment not completed.');
  }

  // 3. Save payment record with SUCCESS status directly
  const paymentRecord = await Payment.create({
    user,
    orderId,
    amount,
    currency,
    method: 'STRIPE',
    status: 'SUCCESS',
    transactionId: confirmedPaymentIntent.id,
    saveCard,
  });

  return paymentRecord;
};

export const PaymentService = {
  // createStripePayment,
  // confirmStripePayment,
  payWithStripeInOneGo,
};
