import { MiddlewareHandler } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { generateToken, verifyToken } from './csrf-utils';

export interface CSRFConfig {
  cookieName?: string;
  headerName?: string;
  cookieOptions?: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
    maxAge?: number;
    path?: string;
  };
}

declare module 'hono' {
  interface ContextVariableMap {
    csrfToken?: string;
  }
}

export const csrf = (config?: CSRFConfig): MiddlewareHandler => {
  const cookieName = config?.cookieName || 'csrf-token';
  const headerName = config?.headerName || 'x-csrf-token';
  const cookieOptions = config?.cookieOptions || {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  };

  return async (c, next) => {
    const method = c.req.method;

    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      await next();
      return;
    }

    const existingToken = getCookie(c, cookieName);

    if (!existingToken) {
      const newToken = generateToken();
      setCookie(c, cookieName, newToken, cookieOptions);
      c.set('csrfToken', newToken);
      await next();
      return;
    }

    const headerToken = c.req.header(headerName);

    if (!headerToken) {
      return c.json(
        { error: 'CSRF token missing' },
        403
      );
    }

    if (!verifyToken(existingToken, headerToken)) {
      return c.json(
        { error: 'Invalid CSRF token' },
        403
      );
    }

    const newToken = generateToken();
    setCookie(c, cookieName, newToken, cookieOptions);
    c.set('csrfToken', newToken);

    await next();
  };
};

export function getCsrfToken(c: {
  get: (key: string) => unknown;
}): string | undefined {
  return c.get('csrfToken') as string | undefined;
}
