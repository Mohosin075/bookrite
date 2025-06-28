import { z } from 'zod';

export const createBannerValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).trim(),
  description: z.string().min(1, { message: 'Description is required' }).trim(),
  image: z.string().url().default('https://i.ibb.co/z5YHLV9/profile.png'),
});

export const updateBannerValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).trim().optional(),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .trim()
    .optional(),
  image: z
    .string()
    .url()
    .default('https://i.ibb.co/z5YHLV9/profile.png')
    .optional(),
});
