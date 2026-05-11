import { Module } from '@nestjs/common';

import { PublisherModule } from '@app/publisher';
import { QueueName } from '@app/queue';

import { TasksService } from './tasks.service';

@Module({
  imports: [
    PublisherModule.forRoot({
      withKafka: true,
      withPubSub: true,
      queues: [QueueName.Reports],
      kafkaClientId: 'cron',
    }),
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
