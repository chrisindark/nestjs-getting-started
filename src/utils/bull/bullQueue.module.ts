import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('BULL_QUEUE_HOST'),
          port: configService.get('BULL_QUEUE_PORT'),
          retryStrategy() {
            return null;
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [],
})
export class BullQueueModule {}
