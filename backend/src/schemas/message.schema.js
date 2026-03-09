import { z } from 'zod';

export const messageSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100)
    .trim()
    .regex(/^[^<>]*$/, 'Name cannot contain < or > characters'),
  email: z.string().email('Invalid email').max(200).trim(),
  phone: z
    .string()
    .regex(/^[\d\s\-\(\)\+]{10,15}$/, 'Invalid phone number')
    .trim()
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000)
    .trim()
    .regex(/^[^<>]*$/, 'Message cannot contain < or > characters'),
});
