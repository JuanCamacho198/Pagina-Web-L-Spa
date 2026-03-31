import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/node';

interface ValidationError {
  field: string;
  message: string;
}

@Catch(ZodError)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Format Zod errors into field-level details
    const errors: ValidationError[] = exception.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    const errorResponse = {
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'VALIDATION_ERROR',
      message: 'Validation failed',
      timestamp: new Date().toISOString(),
      path: request.url,
      details: {
        errors,
      },
    };

    // Log validation errors
    this.logger.warn(
      `Validation Error - ${request.method} ${request.url}: ${JSON.stringify(errors)}`
    );

    // Send to Sentry for analysis (but not as error, as warning)
    if (process.env.SENTRY_DSN) {
      Sentry.captureMessage('Validation Error', 'warning');
    }

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
