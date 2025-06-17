import { z } from 'zod';

export const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }),
    description: z.string().optional(),
  }),
});

export const updateCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  }),
});
