import { z } from 'zod';

export const orderSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100)
    .regex(
      /^[a-zA-Z\s.'-]+$/,
      'Name must contain only letters, spaces, and basic punctuation'
    ),
  email: z.string().email().max(200),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  address: z.string().min(1).max(500),
  city: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z\s.'-]+$/, 'City must contain only letters'),
  state: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z\s]+$/, 'State must contain only letters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  total: z.number().positive(),
  items: z
    .array(
      z.object({
        productId: z.string().cuid(),
        name: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1),
});

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED']),
});
