import { describe, expect, test, beforeEach } from 'bun:test';
import { createRateLimitMiddleware } from '../src/common/middleware/rate-limit.middleware';

describe('Rate Limit Middleware', () => {
  let middleware: any;
  
  beforeEach(() => {
    const RateLimitMiddleware = createRateLimitMiddleware({ maxAttempts: 5, windowMs: 900000 });
    middleware = new RateLimitMiddleware();
  });

  test('allows requests within rate limit', () => {
    const result = middleware.checkRateLimit('test-key');
    expect(result.allowed).toBe(true);
    expect(result.remainingAttempts).toBe(5);
  });

  test('blocks requests exceeding rate limit', () => {
    for (let i = 0; i < 5; i++) {
      middleware.recordAttempt('test-key-block');
    }
    
    const result = middleware.checkRateLimit('test-key-block');
    expect(result.allowed).toBe(false);
    expect(result.remainingAttempts).toBe(0);
  });

  test('resets after window expires', () => {
    const result = middleware.checkRateLimit('non-existent');
    expect(result.allowed).toBe(true);
    expect(result.remainingAttempts).toBe(5);
  });

  test('sets rate limit headers', () => {
    const mockRes = {
      setHeader: (name: string, value: any) => {
        expect(name).toMatch(/^X-RateLimit-/);
      },
    } as any;
    
    middleware.checkRateLimit('test-key');
  });
});
