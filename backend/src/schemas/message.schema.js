import { z } from 'zod';

export const messageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').max(200),
  phone: z
    .string()
    .regex(/^[\d\s\-\(\)\+]{10,15}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  message: z.string().min(1, 'Message is required').max(2000),
});
