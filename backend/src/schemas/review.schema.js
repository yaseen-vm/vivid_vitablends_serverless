import { z } from 'zod';

export const reviewSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100)
    .trim()
    .regex(/^[^<>]*$/, 'Name cannot contain < or > characters'),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .min(1, 'Comment is required')
    .max(1000)
    .trim()
    .regex(/^[^<>]*$/, 'Comment cannot contain < or > characters'),
  showInHero: z.boolean().optional(),
});

export const reviewUpdateSchema = z.object({
  showInHero: z.boolean(),
});

export const reviewQuerySchema = z.object({
  showInHero: z.enum(['true', 'false']).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});
