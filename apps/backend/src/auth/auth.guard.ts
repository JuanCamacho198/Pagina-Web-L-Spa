import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { user, eq } from '@l-spa/database';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT') private readonly auth: any,
    @Inject('DRIZZLE_CONNECTION') private readonly db: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // better-auth v1.5 might use fromNodeHeaders or just accept the node headers
    // The design doc says auth.api.getSession({ headers: req.headers })
    // Let's try passing headers directly as better-auth usually handles it via its client.
    // However, on the server side using the auth instance directly:
    // auth.api.getSession({ headers: request.headers }) might work if better-auth handles IncomingHttpHeaders.
    
    // Using fromNodeHeaders is safer if available
    const headers = fromNodeHeaders(request.headers);

    const session = await this.auth.api.getSession({
      headers,
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const dbUser = await this.db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    request.user = {
      ...session.user,
      role: dbUser[0]?.role ?? 'customer',
    };
    request.session = session.session;
    return true;
  }
}
