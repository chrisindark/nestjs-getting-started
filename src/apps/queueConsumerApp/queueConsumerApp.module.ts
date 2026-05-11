import { Module } from '@nestjs/common';

import { AppConfigModule } from '@app/config';

import { ReportsQueueModule } from './modules/reportsQueue/reportsQueue.module';

/**
 * Standalone consumer service for Bull queues. Owns every `@Processor`.
 * Producers (API, cron, other microservices) enqueue jobs via
 * `PublisherService.toQueue(...)` — this app does the work.
 *
 * To add a new queue: create `modules/<name>/<name>.consumer.ts` +
 * `<name>.module.ts`, then import the new module here.
 */
@Module({
  imports: [AppConfigModule.forRoot(), ReportsQueueModule],
})
export class QueueConsumerAppModule {}
