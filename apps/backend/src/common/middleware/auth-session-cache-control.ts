import type { NextFunction, Request, Response } from 'express';

const NON_CACHEABLE_AUTH_PREFIXES = ['/api/v1/auth/get-session', '/api/v1/auth/sign-in', '/api/v1/auth/sign-out'];

export function isNonCacheableAuthPath(path: string): boolean {
  return NON_CACHEABLE_AUTH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export function authSessionNoCacheMiddleware(req: Request, res: Response, next: NextFunction) {
  if (isNonCacheableAuthPath(req.path)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }

  next();
}
