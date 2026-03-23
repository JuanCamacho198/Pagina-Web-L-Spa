import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(@Inject('AUTH_CLIENT') private readonly auth: any) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const headers = fromNodeHeaders(request.headers);

    try {
      const session = await this.auth.api.getSession({
        headers,
      });

      if (session) {
        request.user = session.user;
        request.session = session.session;
      }
    } catch (error) {
      // Ignore errors, treat as unauthenticated
    }

    return true;
  }
}
