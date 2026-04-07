import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LockoutService } from '../services/lockout.service';
import { user, eq } from '@l-spa/database';

@Injectable()
export class LockoutGuard implements CanActivate {
  private readonly logger = new Logger(LockoutGuard.name);

  constructor(
    @Inject('DRIZZLE_CONNECTION') private readonly db: any,
    private readonly lockoutService: LockoutService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (request.method !== 'POST') {
      return true;
    }

    const path = request.path;
    const isSignIn = path.includes('sign-in') || path.endsWith('/sign-in');
    
    if (!isSignIn) {
      return true;
    }

    const email = request.body?.email;
    if (!email) {
      return true;
    }

    try {
      const [dbUser] = await this.db
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

      if (!dbUser) {
        return true;
      }

      const lockout = await this.lockoutService.checkLockout(dbUser.id);
      
      if (lockout) {
        const retryAfterSeconds = Math.ceil(
          (new Date(lockout.expiresAt).getTime() - Date.now()) / 1000
        );

        response.setHeader('Retry-After', retryAfterSeconds);
        response.setHeader('X-RateLimit-Limit', 0);
        response.setHeader('X-RateLimit-Remaining', 0);
        response.setHeader('X-RateLimit-Reset', retryAfterSeconds);

        throw new HttpException(
          {
            statusCode: HttpStatus.LOCKED,
            error: 'ACCOUNT_LOCKED',
            message: 'Account temporarily locked due to too many failed login attempts',
            retryAfterSeconds,
            lockoutExpiresAt: lockout.expiresAt,
          },
          HttpStatus.LOCKED
        );
      }

      response.setHeader('X-RateLimit-Limit', 5);
      response.setHeader('X-RateLimit-Remaining', 5);

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`LockoutGuard error: ${error}`);
      return true;
    }
  }
}
