import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { ZodValidationPipe } from 'nestjs-zod';
import * as Sentry from '@sentry/node';

type NodeHandler = (req: any, res: any) => any;

let cachedHandler: NodeHandler | null = null;

function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: 1.0,
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },
  });
}

async function createHandler(): Promise<NodeHandler> {
  initSentry();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

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

  app.useGlobalFilters(new ValidationExceptionFilter(), new AllExceptionsFilter());
  app.useGlobalPipes(new ZodValidationPipe());

  await app.init();

  const instance = app.getHttpAdapter().getInstance();
  return (req, res) => instance(req, res);
}

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    cachedHandler = await createHandler();
  }

  return cachedHandler(req, res);
}
