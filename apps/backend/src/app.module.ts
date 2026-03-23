import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './modules/services/services.module';
import { UsersModule } from './modules/users/users.module';
import { CartModule } from './modules/cart/cart.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { SettingsModule } from './modules/settings/settings.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
export class AppModule {}
