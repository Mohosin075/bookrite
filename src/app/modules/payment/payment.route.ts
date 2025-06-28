import express from 'express';
import { PaymentController } from './payment.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { createPaymentZodSchema } from './payment.validation';

const router = express.Router();

router.post(
  '/create-stripe-payment',
  auth(USER_ROLES.USER),
  validateRequest(createPaymentZodSchema),
  PaymentController.createStripePayment,
);

export const paymentRoutes = router;
