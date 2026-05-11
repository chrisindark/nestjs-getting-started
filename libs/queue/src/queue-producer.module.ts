import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { QUEUE_PREFIX, QueueName } from './queue.constants';
import { QueueModule } from './queue.module';
import {
  QUEUE_PRODUCER_REGISTERED,
  QueueProducerService,
} from './queue-producer.service';

/**
 * Registers one or more Bull queues for producing jobs and exposes the
 * typed `QueueProducerService`. Use from any app that needs to enqueue:
 *
 *   imports: [QueueProducerModule.register([QueueName.Reports])]
 *
 * Consumers register the same queues via their own `@Processor` modules
 * (see `apps/queueConsumerApp/modules/<name>/<name>.module.ts`).
 */
@Module({})
export class QueueProducerModule {
  static register(queues: QueueName[]): DynamicModule {
    const bullRegistrations = queues.map((name) =>
      BullModule.registerQueue({
        name,
        prefix: QUEUE_PREFIX,
      }),
    );

    return {
      module: QueueProducerModule,
      imports: [QueueModule, ...bullRegistrations],
      providers: [
        QueueProducerService,
        { provide: QUEUE_PRODUCER_REGISTERED, useValue: queues },
      ],
      exports: [QueueProducerService, BullModule],
    };
  }
}
