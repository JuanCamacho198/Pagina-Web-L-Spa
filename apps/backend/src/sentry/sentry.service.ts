import * as Sentry from '@sentry/node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SentryService {
  constructor() {
    this.init();
  }

  private init() {
    const dsn = process.env.SENTRY_DSN;

    if (!dsn) {
      console.log('[Sentry] SENTRY_DSN not found, Sentry disabled');
      return;
    }

    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0,
      integrations: [
        // Add NestJS/Observability integrations if needed
      ],
      beforeSend(event) {
        // Sanitize sensitive data
        if (event.request?.headers) {
          // Remove sensitive headers
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }
        return event;
      },
    });

    console.log('[Sentry] Initialized successfully');
  }

  captureException(error: unknown) {
    Sentry.captureException(error);
  }

  captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
    Sentry.captureMessage(message, level);
  }

  setUser(user: { id: string; email?: string }) {
    Sentry.setUser(user);
  }

}
