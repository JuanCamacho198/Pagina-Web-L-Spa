import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpException } from '@nestjs/common';

@Catch(HttpException)
export class RateLimitExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RateLimitExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      const errorResponse = typeof exceptionResponse === 'object' 
        ? exceptionResponse as Record<string, unknown>
        : { message: exceptionResponse };

      const responseBody = {
        statusCode: status,
        error: 'TOO_MANY_REQUESTS',
        message: errorResponse.message || 'Too many requests',
        timestamp: new Date().toISOString(),
        path: request.url,
        retryAfterSeconds: errorResponse.retryAfterSeconds,
      };

      this.logger.warn(
        `Rate limit exceeded - ${request.method} ${request.url} from ${request.ip}`
      );

      response
        .status(status)
        .setHeader('Content-Type', 'application/json')
        .json(responseBody);
      return;
    }

    response.status(status).json(exceptionResponse);
  }
}
