import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getRateLimiter, RedisRateLimiter } from '../../lib/rate-limiter';
import { detectEndpointCategory, getUserIdFromRequest, getClientIp } from '../../lib/endpoint-categories';

@Injectable()
export class UserRateLimitMiddleware implements NestMiddleware {
  private rateLimiter: RedisRateLimiter | null = null;
  private initialized = false;

  async use(req: Request, res: Response, next: NextFunction) {
    if (!this.initialized) {
      this.rateLimiter = await getRateLimiter();
      this.initialized = true;
    }

    const limiter = this.rateLimiter;
    if (!limiter) {
      return next();
    }

    const category = detectEndpointCategory(req);
    const userId = getUserIdFromRequest(req);
    const clientIp = getClientIp(req);

    const key = userId || clientIp;

    const perMinuteLimit = limiter.getCategoryLimit(category, 60000);
    const perHourLimit = limiter.getCategoryLimit(category, 3600000);

    const minuteResult = await limiter.checkLimit(key, perMinuteLimit, 60000);
    const hourResult = await limiter.checkLimit(key, perHourLimit, 3600000);

    const isLimited = !minuteResult.allowed || !hourResult.allowed;
    const remaining = Math.min(minuteResult.remaining, hourResult.remaining);
    const limit = perMinuteLimit;
    const reset = Math.min(minuteResult.reset, hourResult.reset);

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);
    res.setHeader('X-RateLimit-Window', 'per-minute');

    if (isLimited) {
      res.setHeader('Retry-After', Math.ceil((res.getHeader('Retry-After') as number || reset) - Date.now() / 1000));
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `Rate limit exceeded for ${category} endpoints. Please try again later.`,
          category,
          limit,
          remaining: 0,
          reset,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    next();
  }
}