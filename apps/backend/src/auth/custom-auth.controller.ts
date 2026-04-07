import { Controller, Post, Req, Res, HttpCode, HttpStatus, Inject, Logger, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { passwordValidationSchema } from './schemas/password.validation';
import { ZodError } from 'zod';
import { AuditService } from '../common/audit.service.js';
import { db, user, eq } from '@l-spa/database';

interface SignUpBody {
  email: string;
  password: string;
  name?: string;
  [key: string]: unknown;
}

interface SignInBody {
  email: string;
  password: string;
  [key: string]: unknown;
}

@Controller('api/v1/auth')
export class CustomAuthController {
  private readonly logger = new Logger(CustomAuthController.name);

  constructor(
    @Inject('AUTH_CLIENT') private readonly auth: any,
    @Inject(AuditService) private readonly auditService: AuditService
  ) {}

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
    const controller = this;

    res.send = function(body: unknown) {
      const parsed = typeof body === 'string' ? JSON.parse(body) : body;
      
      if (parsed.user) {
        controller.logger.log(`User signed up: ${parsed.user.email}`);
      }
      
      return originalSend(body);
    };

    const handler = toNodeHandler(this.auth);
    return handler(req, res);
  }

  @Post('sign-in/email')
  @HttpCode(HttpStatus.OK)
  async signIn(@Req() req: Request, @Res() res: Response) {
    const body = req.body as SignInBody;
    const { email } = body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const existingUser = await db.select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0 && !existingUser[0].emailVerified) {
      await this.auditService.log({
        userId: existingUser[0].id,
        action: 'LOGIN_FAILED',
        ipAddress,
        userAgent,
        success: false,
        metadata: { reason: 'email_not_verified' },
      });

      throw new HttpException({
        statusCode: HttpStatus.FORBIDDEN,
        error: 'EMAIL_NOT_VERIFIED',
        message: 'Por favor verifica tu correo electrónico antes de iniciar sesión',
      }, HttpStatus.FORBIDDEN);
    }

    const originalSend = res.send.bind(res);
    const authController = this;

    res.send = function(body: unknown) {
      const parsed = typeof body === 'string' ? JSON.parse(body) : body;
      
      if (parsed.user) {
        authController.auditService.log({
          userId: parsed.user.id,
          action: 'LOGIN_SUCCESS',
          ipAddress,
          userAgent,
          success: true,
        }).catch(() => {});
      } else if (parsed.error) {
        authController.auditService.log({
          userId: email,
          action: 'LOGIN_FAILED',
          ipAddress,
          userAgent,
          success: false,
          metadata: { error: parsed.error },
        }).catch(() => {});
      }
      
      return originalSend(body);
    };

    const handler = toNodeHandler(this.auth);
    return handler(req, res);
  }
}