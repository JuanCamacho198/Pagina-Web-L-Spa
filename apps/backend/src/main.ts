import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
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

  // Global Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Pipe
  app.useGlobalPipes(new ZodValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Nest application successfully started on: ${await app.getUrl()}`);
}
bootstrap();
