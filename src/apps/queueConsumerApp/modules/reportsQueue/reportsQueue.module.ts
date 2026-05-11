import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import {
  QUEUE_PREFIX,
  QUEUE_SETTINGS,
  QueueModule,
  QueueName,
} from '@app/queue';

import { ReportsQueueProcessor } from './reportsQueue.consumer';

@Module({
  imports: [
    QueueModule,
    BullModule.registerQueue({
      name: QueueName.Reports,
      prefix: QUEUE_PREFIX,
      settings: QUEUE_SETTINGS,
    }),
  ],
  providers: [ReportsQueueProcessor],
})
export class ReportsQueueModule {}
