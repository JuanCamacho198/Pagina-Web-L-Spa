import * as Sentry from '@sentry/hono/node';
import { logger } from './logger.js';

export const initSentry = () => {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    logger.warn('Sentry DSN not set, skipping Sentry init');
    return;
  }
  
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
};

export { Sentry };
