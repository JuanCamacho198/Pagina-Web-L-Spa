import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import type { RateLimitConfig, RateLimitResult } from '@l-spa/shared-types';

interface RateLimitEntry {
  attempts: number;
  firstAttemptAt: number;
  blocked: boolean;
  blockedAt: number | null;
}

export function createRateLimitMiddleware(config?: Partial<RateLimitConfig>) {
  const defaultConfig: RateLimitConfig = {
    maxAttempts: config?.maxAttempts ?? 5,
    windowMs: config?.windowMs ?? 900000,
    lockoutDurationMs: config?.lockoutDurationMs ?? 900000,
  };

  @Injectable()
  class RateLimitMiddlewareImpl implements NestMiddleware {
    private readonly store = new Map<string, RateLimitEntry>();
    private readonly config: RateLimitConfig;

    constructor() {
      this.config = defaultConfig;
    }

    private getKey(req: Request): string {
      const ip = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const email = req.body?.email || 'unknown';
      return `${ip}:${email}`;
    }

    private checkRateLimit(key: string): RateLimitResult {
      const now = Date.now();
      const entry = this.store.get(key);

      if (!entry) {
        return {
          allowed: true,
          remainingAttempts: this.config.maxAttempts,
          resetAt: null,
          retryAfterSeconds: null,
        };
      }

      if (entry.blocked) {
        const windowExpired = now - entry.blockedAt! > this.config.lockoutDurationMs;
        
        if (windowExpired) {
          this.store.delete(key);
          return {
            allowed: true,
            remainingAttempts: this.config.maxAttempts,
            resetAt: null,
            retryAfterSeconds: null,
          };
        }

        const retryAfterSeconds = Math.ceil(
          (this.config.lockoutDurationMs - (now - entry.blockedAt!)) / 1000
        );

        return {
          allowed: false,
          remainingAttempts: 0,
          resetAt: new Date(entry.blockedAt! + this.config.lockoutDurationMs),
          retryAfterSeconds,
        };
      }

      const windowExpired = now - entry.firstAttemptAt > this.config.windowMs;

      if (windowExpired) {
        this.store.delete(key);
        return {
          allowed: true,
          remainingAttempts: this.config.maxAttempts,
          resetAt: null,
          retryAfterSeconds: null,
        };
      }

      const remainingAttempts = Math.max(0, this.config.maxAttempts - entry.attempts);

      return {
        allowed: entry.attempts < this.config.maxAttempts,
        remainingAttempts,
        resetAt: new Date(entry.firstAttemptAt + this.config.windowMs),
        retryAfterSeconds: null,
      };
    }

    private recordAttempt(key: string): void {
      const now = Date.now();
      const entry = this.store.get(key);

      if (!entry) {
        this.store.set(key, {
          attempts: 1,
          firstAttemptAt: now,
          blocked: false,
          blockedAt: null,
        });
        return;
      }

      if (entry.blocked) {
        return;
      }

      const windowExpired = now - entry.firstAttemptAt > this.config.windowMs;

      if (windowExpired) {
        this.store.set(key, {
          attempts: 1,
          firstAttemptAt: now,
          blocked: false,
          blockedAt: null,
        });
        return;
      }

      const newAttempts = entry.attempts + 1;

      if (newAttempts >= this.config.maxAttempts) {
        this.store.set(key, {
          attempts: newAttempts,
          firstAttemptAt: entry.firstAttemptAt,
          blocked: true,
          blockedAt: now,
        });
      } else {
        this.store.set(key, {
          attempts: newAttempts,
          firstAttemptAt: entry.firstAttemptAt,
          blocked: false,
          blockedAt: null,
        });
      }
    }

    use(req: Request, res: Response, next: NextFunction) {
      const key = this.getKey(req);
      const result = this.checkRateLimit(key);

      res.setHeader('X-RateLimit-Limit', this.config.maxAttempts);
      res.setHeader('X-RateLimit-Remaining', result.remainingAttempts);

      if (result.resetAt) {
        const resetSeconds = Math.ceil((result.resetAt.getTime() - Date.now()) / 1000);
        res.setHeader('X-RateLimit-Reset', resetSeconds);
      }

      if (!result.allowed) {
        if (result.retryAfterSeconds) {
          res.setHeader('Retry-After', result.retryAfterSeconds);
        }

        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: 'Too Many Requests',
            message: 'Too many login attempts. Please try again later.',
            retryAfterSeconds: result.retryAfterSeconds,
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      const originalSend = res.send;
      const middleware = this;

      res.send = function (body?: any) {
        const statusCode = res.statusCode;

        if (statusCode === 401 && req.method === 'POST') {
          middleware.recordAttempt(key);
        }

        return originalSend.call(this, body);
      };

      next();
    }
  }

  return RateLimitMiddlewareImpl;
}
