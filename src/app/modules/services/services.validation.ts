import { Types } from 'mongoose';
import { z } from 'zod';

const objectId = () =>
  z.string().refine(val => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

export const createServiceZodSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    price: z.number().gt(0),
    category: objectId(),
    provider: objectId(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});
