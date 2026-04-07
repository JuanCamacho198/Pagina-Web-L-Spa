import { z } from 'zod';

export const endpointCategorySchema = z.enum(['auth', 'write', 'read', 'unauthenticated']);
export type EndpointCategory = z.infer<typeof endpointCategorySchema>;

export const categoryLimitsSchema = z.object({
  perMinute: z.number().min(1).default(100),
  perHour: z.number().min(1).default(1000),
});

export const categoryLimitsMapSchema = z.object({
  auth: categoryLimitsSchema.default({ perMinute: 10, perHour: 100 }),
  write: categoryLimitsSchema.default({ perMinute: 30, perHour: 300 }),
  read: categoryLimitsSchema.default({ perMinute: 100, perHour: 1000 }),
  unauthenticated: categoryLimitsSchema.default({ perMinute: 20, perHour: 200 }),
});

export type CategoryLimits = z.infer<typeof categoryLimitsSchema>;
export type CategoryLimitsMap = z.infer<typeof categoryLimitsMapSchema>;

export const userRateLimitConfigSchema = z.object({
  categoryLimits: categoryLimitsMapSchema.default({
    auth: { perMinute: 10, perHour: 100 },
    write: { perMinute: 30, perHour: 300 },
    read: { perMinute: 100, perHour: 1000 },
    unauthenticated: { perMinute: 20, perHour: 200 },
  }),
  redisUrl: z.string().optional(),
  redisHost: z.string().default('localhost'),
  redisPort: z.number().default(6379),
  redisPassword: z.string().optional(),
  fallbackToMemory: z.boolean().default(true),
});

export type UserRateLimitConfig = z.infer<typeof userRateLimitConfigSchema>;

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

export const slidingWindowResultSchema = z.object({
  allowed: z.boolean(),
  limit: z.number(),
  remaining: z.number(),
  reset: z.number(),
});

export type SlidingWindowResult = z.infer<typeof slidingWindowResultSchema>;
