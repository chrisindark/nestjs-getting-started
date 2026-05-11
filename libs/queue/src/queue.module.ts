import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Registers the global Bull/Redis connection used by every queue in the
 * system. Import this once per app (producers and consumers alike) and
 * then register specific queues with `QueueProducerModule.register([...])`
 * or per-queue consumer modules.
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('BULL_QUEUE_HOST') ?? '127.0.0.1',
          port: Number(config.get<number | string>('BULL_QUEUE_PORT')) || 6379,
          password: config.get<string>('BULL_QUEUE_PASSWORD') || undefined,
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
