import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  price: z.number().positive(),
  categoryId: z.string().cuid(),
  image: z.string().url().or(z.string().startsWith('data:image/')),
  featured: z.boolean().optional(),
  badge: z.string().max(50).optional(),
  originalPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().cuid().optional(),
  image: z.string().url().or(z.string().startsWith('data:image/')).optional(),
  featured: z.boolean().optional(),
  badge: z.string().max(50).optional(),
  originalPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
});
