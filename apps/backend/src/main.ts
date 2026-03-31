import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { ZodValidationPipe } from 'nestjs-zod';
import * as Sentry from '@sentry/node';

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

  // CORS Configuration
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://l-spa-frontend.vercel.app',
      'https://l-spa.vercel.app',
      /^https:\/\/l-spa-git-.*-\.vercel\.app$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Anonymous-ID', 'X-User-ID', 'x-csrf-token'],
    exposedHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  });

  // Global Filters (order matters - more specific first)
  app.useGlobalFilters(new ValidationExceptionFilter(), new AllExceptionsFilter());

  // Global Pipe
  app.useGlobalPipes(new ZodValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Nest application successfully started on: ${await app.getUrl()}`);
}
bootstrap();
