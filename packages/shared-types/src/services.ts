import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  category: z.string().min(1),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  duration: z.coerce.number().int().min(5),
  includes: z.string().optional().nullable(),
  idealFor: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  contraindications: z.string().optional().nullable(),
  intensity: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.number().int().min(1).max(5).optional())
});

export const updateServiceSchema = serviceSchema.partial().extend({
  id: z.string().uuid()
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;

export interface Service extends ServiceSchema {
  id: string;
  image_url?: string; // Compatibility with both camelCase and snake_case
  imageFileName?: string;
}
