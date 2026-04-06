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
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SentryMiddleware).forRoutes('*');
  }
}
