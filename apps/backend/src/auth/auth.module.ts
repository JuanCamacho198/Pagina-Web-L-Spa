import { Module, Global, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@l-spa/database/schema';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { OptionalAuthGuard } from './optional-auth.guard';
import { RolesGuard } from './roles.guard';
import { getTrustedOrigins } from '../common/cors';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_CLIENT',
      useFactory: (db: any, configService: ConfigService) => {
        return betterAuth({
          database: drizzleAdapter(db, {
            provider: 'pg',
            schema,
          }),
          basePath: '/api/v1/auth',
          emailAndPassword: {
            enabled: true,
          },
          trustedOrigins: getTrustedOrigins(configService.get<string>('BETTER_AUTH_TRUSTED_ORIGINS')),
          advanced: {
            defaultCookieAttributes: {
              sameSite: 'lax',
              secure: configService.get<string>('NODE_ENV') === 'production',
            },
          },
        });
      },
      inject: ['DRIZZLE_CONNECTION', ConfigService],
    },
    AuthGuard,
    OptionalAuthGuard,
    RolesGuard,
  ],
  exports: ['AUTH_CLIENT', AuthGuard, OptionalAuthGuard, RolesGuard],
})
export class AuthModule {}
