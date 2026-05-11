import { Module } from '@nestjs/common';

import { AppConfigModule } from '@app/config';

import { CronModule } from './modules/cron/cron.module';

/**
 * Cron service is producer-only: it schedules ticks via `@nestjs/schedule`
 * and pushes work onto the appropriate transport (Bull queue, Kafka topic,
 * Pub/Sub topic) via the shared `PublisherService`. All side-effect work
 * lives in the dedicated consumer services. Keep this module
 * dependency-light so the cron pod boots fast and has a small blast radius.
 */
@Module({
  imports: [AppConfigModule.forRoot(), CronModule],
})
export class CronAppModule {}
