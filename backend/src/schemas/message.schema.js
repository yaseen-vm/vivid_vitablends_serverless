import { z } from 'zod';

export const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Phone must be 10 digits')
    .optional(),
  message: z.string().min(1).max(2000),
});
