import Redis from 'ioredis';
import type { SlidingWindowResult, UserRateLimitConfig } from '@l-spa/shared-types';

export class RedisRateLimiter {
  private redis: Redis | null = null;
  private memoryFallback: Map<string, { timestamps: number[]; limit: number; windowMs: number }> = new Map();
  private config: UserRateLimitConfig;
  private useMemoryFallback = false;
  private logger = console;

  constructor(config: Partial<UserRateLimitConfig> = {}) {
    this.config = {
      categoryLimits: {
        auth: { perMinute: 10, perHour: 100 },
        write: { perMinute: 30, perHour: 300 },
        read: { perMinute: 100, perHour: 1000 },
        unauthenticated: { perMinute: 20, perHour: 200 },
      },
      redisUrl: config.redisUrl ?? process.env.REDIS_URL,
      redisHost: config.redisHost ?? process.env.REDIS_HOST ?? 'localhost',
      redisPort: config.redisPort ?? parseInt(process.env.REDIS_PORT ?? '6379', 10),
      redisPassword: config.redisPassword ?? process.env.REDIS_PASSWORD,
      fallbackToMemory: config.fallbackToMemory ?? true,
    };
  }

  async initialize(): Promise<void> {
    try {
      if (this.config.redisUrl) {
        this.redis = new Redis(this.config.redisUrl);
      } else {
        this.redis = new Redis({
          host: this.config.redisHost,
          port: this.config.redisPort,
          password: this.config.redisPassword,
          lazyConnect: true,
          maxRetriesPerRequest: 1,
        });
      }

      await this.redis.ping();
      this.useMemoryFallback = false;
      this.logger.log('[RateLimiter] Redis connection established');
    } catch (error) {
      this.useMemoryFallback = this.config.fallbackToMemory;
      this.logger.warn('[RateLimiter] Redis unavailable, using in-memory fallback:', error);
      if (!this.config.fallbackToMemory) {
        throw error;
      }
    }
  }

  private getRedisKey(key: string, windowMs: number): string {
    const windowType = windowMs === 60000 ? 'min' : 'hour';
    return `ratelimit:${windowType}:${key}`;
  }

  async checkLimit(key: string, limit: number, windowMs: number): Promise<SlidingWindowResult> {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (this.useMemoryFallback || !this.redis) {
      return this.checkLimitMemory(key, limit, windowMs, now, windowStart);
    }

    try {
      const redisKey = this.getRedisKey(key, windowMs);
      
      const pipeline = this.redis.pipeline();
      pipeline.zremrangebyscore(redisKey, 0, windowStart);
      pipeline.zadd(redisKey, now, `${now}:${Math.random()}`);
      pipeline.zcard(redisKey);
      pipeline.expire(redisKey, Math.ceil(windowMs / 1000) + 60);
      
      const results = await pipeline.exec();
      const count = results?.[2]?.[1] as number ?? 0;

      const allowed = count <= limit;
      const remaining = Math.max(0, limit - count);
      const reset = windowStart + windowMs;

      return {
        allowed,
        limit,
        remaining,
        reset: Math.ceil(reset / 1000),
      };
    } catch (error) {
      this.logger.warn('[RateLimiter] Redis error, falling back to memory:', error);
      return this.checkLimitMemory(key, limit, windowMs, now, windowStart);
    }
  }

  private checkLimitMemory(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
    windowStart: number
  ): SlidingWindowResult {
    let entry = this.memoryFallback.get(key);

    if (!entry || entry.windowMs !== windowMs) {
      entry = { timestamps: [], limit, windowMs };
      this.memoryFallback.set(key, entry);
    }

    entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);
    entry.timestamps.push(now);

    const count = entry.timestamps.length;
    const allowed = count <= limit;
    const remaining = Math.max(0, limit - count);
    const reset = windowStart + windowMs;

    return {
      allowed,
      limit,
      remaining,
      reset: Math.ceil(reset / 1000),
    };
  }

  getCategoryLimit(category: 'auth' | 'write' | 'read' | 'unauthenticated', windowMs: number): number {
    const limits = this.config.categoryLimits[category];
    return windowMs === 60000 ? limits.perMinute : limits.perHour;
  }

  isUsingMemoryFallback(): boolean {
    return this.useMemoryFallback || !this.redis;
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }
  }
}

let rateLimiterInstance: RedisRateLimiter | null = null;

export async function getRateLimiter(config?: Partial<UserRateLimitConfig>): Promise<RedisRateLimiter> {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RedisRateLimiter(config);
    await rateLimiterInstance.initialize();
  }
  return rateLimiterInstance;
}

export function resetRateLimiter(): void {
  rateLimiterInstance = null;
}