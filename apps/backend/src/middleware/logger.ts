import { logger } from '../lib/logger.js';

export const loggingMiddleware = async (c: any, next: any) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  
  logger.info({
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    duration
  }, 'request');
};
