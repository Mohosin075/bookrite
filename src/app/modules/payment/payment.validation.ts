import { z } from 'zod';
import { Types } from 'mongoose';

export const createPaymentZodSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User ID is required' }),
    orderId: z.string().optional(),
    amount: z.number({ required_error: 'Amount is required' }).min(1),
    currency: z.string().default('USD'),
    method: z.enum(['CARD', 'CASH', 'BANK', 'STRIPE'], {
      required_error: 'Payment method is required',
    }),
    status: z.enum(['PENDING', 'SUCCESS', 'FAILED']).optional(),
    transactionId: z.string().optional(),
    cardDetails: z
      .object({
        cardHolderName: z.string(),
        last4: z.string().length(4),
        brand: z.string(),
        expiryMonth: z.number().min(1).max(12),
        expiryYear: z.number().min(new Date().getFullYear() % 100),
      })
      .optional(),
    saveCard: z.boolean().optional(),
  }),
});
