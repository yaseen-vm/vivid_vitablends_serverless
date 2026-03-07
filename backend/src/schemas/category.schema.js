import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  image: z.string().url().or(z.string().startsWith('data:image/')).optional(),
  showOnHome: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  image: z.string().url().or(z.string().startsWith('data:image/')).optional(),
  showOnHome: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const categoryHomepageSchema = z.object({
  showOnHome: z.boolean(),
  displayOrder: z.number().int().min(0),
});
