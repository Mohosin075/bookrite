import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    contact: z.string({ required_error: 'Contact is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    location: z.string({ required_error: 'Location is required' }),
    profile: z.string().optional(),
  }),
});

const updateUserZodSchema = z.object({
  name: z.string().min(1).optional(),
  contact: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  image: z.string().optional(),
});

const accessLocationZodSchema = z.object({
  islocationGranted: z.boolean().optional(),
});

const addBookmarkZodSchema = z.object({
  body: z.object({
    serviceId: z.string({ required_error: 'Service ID is required' }),
  }),
});

const removeBookmarkZodSchema = z.object({
  body: z.object({
    serviceId: z.string({ required_error: 'Service ID is required' }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  accessLocationZodSchema,
  addBookmarkZodSchema,
  removeBookmarkZodSchema,
};
