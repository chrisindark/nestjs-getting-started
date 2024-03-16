import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BullQueueConsumerService } from './bullQueueConsumer.service';
import { BullQueueConsumerController } from './bullQueueConsumer.controller';

const QUEUE_SETTINGS = {
  maxStalledCount: 1,
  lockDuration: 30 * 1000,
  lockRenewTime: 15 * 1000,
};

@Global()
@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'ReportsQueueConsumer',
      imports: [ConfigModule],
      useFactory: async () => ({
        prefix: 'rqc',
        settings: QUEUE_SETTINGS,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BullQueueConsumerController],
  providers: [BullQueueConsumerService],
  exports: [BullModule, BullQueueConsumerService],
})
export class BullQueueConsumerModule {}
