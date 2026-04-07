import { z } from 'zod';

export const rateLimitConfigSchema = z.object({
  maxAttempts: z.number().min(1).max(20).default(5),
  windowMs: z.number().min(60000).default(900000),
  lockoutDurationMs: z.number().min(60000).default(900000),
});

export type RateLimitConfig = z.infer<typeof rateLimitConfigSchema>;

export const lockoutRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  lockedAt: z.date(),
  expiresAt: z.date(),
  lockedBy: z.string().default('system'),
});

export type LockoutRecord = z.infer<typeof lockoutRecordSchema>;

export const rateLimitResultSchema = z.object({
  allowed: z.boolean(),
  remainingAttempts: z.number(),
  resetAt: z.date().nullable(),
  retryAfterSeconds: z.number().nullable(),
});

export type RateLimitResult = z.infer<typeof rateLimitResultSchema>;
