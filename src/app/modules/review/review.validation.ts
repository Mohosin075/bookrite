import { Types } from 'mongoose';
import { z } from 'zod';

const objectId = () =>
  z.string().refine(val => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

export const createReviewZodSchema = z.object({
  body: z.object({
    service: objectId(),
    rating: z.number().min(1).max(5),
    reviewText: z.string().min(1),
    tip: z.number().default(0).optional().optional(),
  }),
});
