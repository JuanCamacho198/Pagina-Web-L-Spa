import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ServicesModule } from './modules/services/services.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { CartModule } from './modules/cart/cart.module.js';
import { AppointmentsModule } from './modules/appointments/appointments.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { FavoritesModule } from './modules/favorites/favorites.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { SentryModule } from './sentry/sentry.module.js';
import { HealthController } from './common/health.controller.js';
import { SentryMiddleware } from './common/middleware/sentry.middleware.js';
import { createRateLimitMiddleware } from './common/middleware/rate-limit.middleware.js';
import { SecurityHeadersMiddleware } from './common/middleware/security-headers.middleware.js';
import { AuditService } from './common/audit.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SentryModule,
    DatabaseModule,
    AuthModule,
    ServicesModule,
    UsersModule,
    CartModule,
    AppointmentsModule,
    ReviewsModule,
    FavoritesModule,
    SettingsModule,
  ],
  controllers: [HealthController],
  providers: [AuditService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SentryMiddleware)
      .forRoutes('*');
    
    consumer
      .apply(SecurityHeadersMiddleware)
      .forRoutes('*');
    
    const rateLimitConfig = {
      maxAttempts: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '5', 10),
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      lockoutDurationMs: parseInt(process.env.RATE_LIMIT_LOCKOUT_DURATION_MS || '900000', 10),
    };
    const RateLimitMiddleware = createRateLimitMiddleware(rateLimitConfig);
    consumer.apply(RateLimitMiddleware).forRoutes('auth/sign-in/email', 'auth/sign-up/email');
  }
}
