import { z } from 'zod';

export const reviewSchema = z.object({
  name: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
  showInHero: z.boolean().optional(),
});

export const reviewUpdateSchema = z.object({
  showInHero: z.boolean(),
});

export const reviewQuerySchema = z.object({
  showInHero: z.enum(['true', 'false']).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});
