import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { buildCorsOriginValidator } from './common/cors';
import { ZodValidationPipe } from 'nestjs-zod';
import * as Sentry from '@sentry/node';
import { authSessionNoCacheMiddleware } from './common/middleware/auth-session-cache-control';

// Initialize Sentry if DSN is provided
function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (dsn) {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0,
      beforeSend(event) {
        // Sanitize sensitive data
        if (event.request?.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }
        return event;
      },
    });
    console.log('[Sentry] Initialized');
  } else {
    console.log('[Sentry] Disabled (no SENTRY_DSN)');
  }
}

async function bootstrap() {
  // Initialize Sentry before creating the app
  initSentry();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS;

  // CORS Configuration
  app.enableCors({
    origin: buildCorsOriginValidator(trustedOrigins),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Anonymous-ID', 'X-User-ID', 'x-csrf-token'],
    exposedHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  });

  app.use(authSessionNoCacheMiddleware);

  // Global Filters (order matters - more specific first)
  app.useGlobalFilters(new ValidationExceptionFilter(), new AllExceptionsFilter());

  // Global Pipe
  app.useGlobalPipes(new ZodValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Nest application successfully started on: ${await app.getUrl()}`);
}
bootstrap();
