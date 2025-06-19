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

export const updateServiceZodSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().gt(0).optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});


export const createPortfolioZodSchema = z.object({
  provider: objectId(),
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  thumbnails: z.array(z.string()).optional(),
});


export const updatePortfolioZodSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  image: z.string().optional(),
  description: z.string().min(1, "Description is required").optional(),
  thumbnails: z.array(z.string()).optional(),
});
