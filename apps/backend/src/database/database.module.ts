import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { db } from '@l-spa/database';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DRIZZLE_CONNECTION'],
})
export class DatabaseModule {}
