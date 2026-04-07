import { Controller, Post, Req, Res, HttpCode, HttpStatus, Inject, Logger, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { passwordValidationSchema } from './schemas/password.validation';
import { ZodError } from 'zod';

interface SignUpBody {
  email: string;
  password: string;
  name?: string;
  [key: string]: unknown;
}

@Controller('api/v1/auth')
export class CustomAuthController {
  private readonly logger = new Logger(CustomAuthController.name);

  constructor(@Inject('AUTH_CLIENT') private readonly auth: any) {}

  @Post('sign-up/email')
  @HttpCode(HttpStatus.OK)
  async signUp(@Req() req: Request, @Res() res: Response) {
    const body = req.body as SignUpBody;
    const { email, password, name } = body;

    try {
      passwordValidationSchema.parse(password);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'VALIDATION_ERROR',
          message: 'Password validation failed',
          details: { errors },
        }, HttpStatus.BAD_REQUEST);
      }
    }

    const originalSend = res.send.bind(res);
    const authModule = this;

    res.send = function(body: unknown) {
      const parsed = typeof body === 'string' ? JSON.parse(body) : body;
      
      if (parsed.user) {
        authModule.logger.log(`User signed up: ${parsed.user.email}`);
      }
      
      return originalSend(body);
    };

    const handler = toNodeHandler(this.auth);
    return handler(req, res);
  }
}
