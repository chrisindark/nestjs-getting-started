import { DynamicModule, Module } from '@nestjs/common';

import { KafkaClientModule, PubSubModule } from '@app/messaging';
import { QueueName, QueueProducerModule } from '@app/queue';

import { PublisherService } from './publisher.service';

export interface PublisherModuleOptions {
  /** Wire the Kafka client so `publisher.toKafka(...)` works. */
  withKafka?: boolean;
  /** Wire Google Cloud Pub/Sub so `publisher.toPubSub(...)` works. */
  withPubSub?: boolean;
  /**
   * Bull queues this app is allowed to enqueue to. Omit or pass an empty
   * array to skip wiring the queue backend entirely.
   */
  queues?: QueueName[];
  /** Optional Kafka client id (defaults to `APP_NAME` env). */
  kafkaClientId?: string;
  /** Optional Kafka consumer group id used by the publisher's reply listener. */
  kafkaGroupId?: string;
}

/**
 * Wires whichever transports the calling app needs. Cron might want
 * `{ queues: [...] }`; the API might want `{ withKafka: true, withPubSub: true, queues: [...] }`.
 */
@Module({})
export class PublisherModule {
  static forRoot(options: PublisherModuleOptions = {}): DynamicModule {
    const imports = [];
    if (options.withKafka) {
      imports.push(
        KafkaClientModule.forRoot({
          clientId: options.kafkaClientId,
          groupId: options.kafkaGroupId,
        }),
      );
    }
    if (options.withPubSub) {
      imports.push(PubSubModule);
    }
    if (options.queues && options.queues.length > 0) {
      imports.push(QueueProducerModule.register(options.queues));
    }

    return {
      module: PublisherModule,
      imports,
      providers: [PublisherService],
      exports: [PublisherService],
    };
  }
}
