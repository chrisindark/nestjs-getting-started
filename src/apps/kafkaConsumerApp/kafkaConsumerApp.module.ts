import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppConfigModule } from '@app/config';
import { AppLoggerModule, CorrelationInterceptor } from '@app/logger';

import { EventsModule } from './modules/events/events.module';

/**
 * Standalone Kafka consumer service. Each `@EventPattern` /
 * `@MessagePattern` controller method maps to a Kafka topic. Nest binds
 * everything together when the app is bootstrapped via
 * `bootstrapMicroservice(...)` with the KAFKA transport.
 *
 * The global `CorrelationInterceptor` pulls `x-correlation-id` from
 * each Kafka message's headers and seeds an AsyncLocalStorage context,
 * so every log line emitted by a handler carries the upstream
 * correlation id.
 *
 * Producers don't go through this app — they publish via
 * `PublisherService.toKafka(pattern, payload)`.
 */
@Module({
  imports: [
    AppConfigModule.forRoot(),
    AppLoggerModule.forRoot({ appName: 'kafka-consumer' }),
    EventsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationInterceptor,
    },
  ],
})
export class KafkaConsumerAppModule {}
