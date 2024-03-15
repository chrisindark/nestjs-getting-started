import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { QueueController } from './queue.controller';
import { CronQueueConsumer } from './cron.queue.consumer';
import { KafkaQueueConsumer } from './kafka.queue.consumer';
import { QueueService } from './queue.service';

const REDIS_SETTINGS = {
  settings: {
    maxStalledCount: 1,
    lockDuration: 30 * 1000,
    lockRenewTime: 15 * 1000,
  },
};
@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueueAsync({
      name: 'CronQueueConsumer',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        prefix: 'cqc',
        settings: REDIS_SETTINGS.settings,
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          retryStrategy(times: number) {
            return null;
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'KafkaQueueConsumer',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        prefix: 'kqc',
        settings: REDIS_SETTINGS.settings,
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          retryStrategy(times: number) {
            return null;
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [QueueController],
  providers: [QueueService, CronQueueConsumer, KafkaQueueConsumer],
  exports: [QueueService],
})
export class QueueModule {}
