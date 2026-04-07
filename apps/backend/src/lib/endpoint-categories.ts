import type { Request } from 'express';
import type { EndpointCategory } from '@l-spa/shared-types';

const AUTH_PATTERNS = [
  /^\/api\/v1\/auth\//,
  /^\/auth\//,
  /^\/api\/auth\//,
  /\/sign-in\//,
  /\/sign-up\//,
  /\/login\//,
  /\/register\//,
];

const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export function detectEndpointCategory(req: Request): EndpointCategory {
  const path = req.path || req.url;
  const method = req.method?.toUpperCase() ?? 'GET';

  for (const pattern of AUTH_PATTERNS) {
    if (pattern.test(path)) {
      return 'auth';
    }
  }

  if (WRITE_METHODS.includes(method)) {
    return 'write';
  }

  if (method === 'GET') {
    return 'read';
  }

  return 'unauthenticated';
}

export function isAuthenticatedRequest(req: Request): boolean {
  return !!(req.user && (req.user as any).id);
}

export function getUserIdFromRequest(req: Request): string | null {
  if (req.user && (req.user as any).id) {
    return (req.user as any).id;
  }
  return null;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}