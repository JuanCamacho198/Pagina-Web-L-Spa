import { describe, expect, it } from 'bun:test';
import {
  authSessionNoCacheMiddleware,
  isNonCacheableAuthPath,
} from '../src/common/middleware/auth-session-cache-control';

describe('authSessionNoCacheMiddleware', () => {
  it('identifies auth session endpoints as non-cacheable', () => {
    expect(isNonCacheableAuthPath('/api/v1/auth/get-session')).toBe(true);
    expect(isNonCacheableAuthPath('/api/v1/auth/sign-in/email')).toBe(true);
    expect(isNonCacheableAuthPath('/api/v1/auth/sign-out')).toBe(true);
    expect(isNonCacheableAuthPath('/api/v1/services')).toBe(false);
  });

  it('sets no-cache headers for auth session routes', () => {
    const headers = new Map<string, string>();
    const req = { path: '/api/v1/auth/get-session' } as any;
    const res = {
      setHeader: (key: string, value: string) => headers.set(key, value),
    } as any;
    let nextCalled = false;

    authSessionNoCacheMiddleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate, proxy-revalidate');
    expect(headers.get('Pragma')).toBe('no-cache');
    expect(headers.get('Expires')).toBe('0');
    expect(headers.get('Surrogate-Control')).toBe('no-store');
  });

  it('does not set no-cache headers for non-auth routes', () => {
    const headers = new Map<string, string>();
    const req = { path: '/api/v1/services' } as any;
    const res = {
      setHeader: (key: string, value: string) => headers.set(key, value),
    } as any;

    authSessionNoCacheMiddleware(req, res, () => undefined);

    expect(headers.size).toBe(0);
  });
});
