import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorMessage = (typeof message === 'object' && message !== null) 
      ? (message as any).message || message 
      : message;

    // Log error to console
    this.logger.error(
      `${status} - ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Send error to Sentry if DSN is configured
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(exception, {
        extra: {
          status,
          method: request.method,
          url: request.url,
          body: request.body,
        },
      });
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    };

    response.status(status).json(errorResponse);
  }
}
