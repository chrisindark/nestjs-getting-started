import { Module } from '@nestjs/common';

import { AppConfigModule } from '@app/config';

import { EventsModule } from './modules/events/events.module';

/**
 * Standalone Kafka consumer service. Each `@EventPattern` /
 * `@MessagePattern` controller method maps to a Kafka topic. Nest binds
 * everything together when the app is bootstrapped via
 * `bootstrapMicroservice(...)` with the KAFKA transport.
 *
 * Producers don't go through this app — they publish via
 * `PublisherService.toKafka(pattern, payload)`.
 */
@Module({
  imports: [AppConfigModule.forRoot(), EventsModule],
})
export class KafkaConsumerAppModule {}
