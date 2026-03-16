import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  serviceId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
  createdAt: z.date().optional()
});

export type Review = z.infer<typeof reviewSchema>;

export interface SanitizeOptions {
  stripBlankChars?: boolean;
  maxLength?: number;
}

export const reviewSanitizedSchema = reviewSchema.extend({
  comment: z.string().optional().nullable()
});

export type ReviewSanitized = z.infer<typeof reviewSanitizedSchema>;
