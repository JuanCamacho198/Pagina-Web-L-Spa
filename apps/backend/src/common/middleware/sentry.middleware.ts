import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Only track if Sentry is initialized
    if (!process.env.SENTRY_DSN) {
      return next();
    }

    // Add request context to Sentry
    Sentry.setContext('request', {
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        userAgent: req.headers['user-agent'],
      },
    });

    // Capture request as a breadcrumb
    Sentry.addBreadcrumb({
      category: 'http',
      message: `${req.method} ${req.url}`,
      level: 'info',
    });

    next();
  }
}
