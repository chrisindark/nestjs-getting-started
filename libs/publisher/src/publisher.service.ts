import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import type { Job, JobOptions } from 'bull';
import { firstValueFrom } from 'rxjs';

import { KAFKA_CLIENT, PubSubService } from '@app/messaging';
import type { ClientKafka } from '@nestjs/microservices';
import {
  QueueJobName,
  QueueJobPayload,
  QueueName,
  QueueProducerService,
} from '@app/queue';

/**
 * Single point of trigger for emitting work to any of the asynchronous
 * transports the platform supports. Inject from any app (API, cron, CLI,
 * other microservices) so producers don't have to know which transport
 * they're talking to:
 *
 *   constructor(private readonly publisher: PublisherService) {}
 *
 *   this.publisher.toKafka('user.created', { id });
 *   this.publisher.toPubSub('emails', payload);
 *   this.publisher.toQueue(QueueName.Reports, JobName.GenerateReport, payload);
 *
 * Each backend is optional — `PublisherModule.forRoot({ ... })` decides
 * which transports get wired in for a given app. Calling a method whose
 * backend isn't wired throws a clear error instead of silently dropping
 * the event.
 */
@Injectable()
export class PublisherService {
  private readonly logger = new Logger(PublisherService.name);

  constructor(
    @Optional() @Inject(KAFKA_CLIENT) private readonly kafka?: ClientKafka,
    @Optional() private readonly pubsub?: PubSubService,
    @Optional() private readonly queue?: QueueProducerService,
  ) {}

  /**
   * Emit a fire-and-forget Kafka event. The pattern (topic name) and
   * payload format must match what a consumer's `@EventPattern(pattern)`
   * expects.
   */
  async toKafka(pattern: string, payload: unknown): Promise<void> {
    if (!this.kafka) {
      throw new Error(
        'PublisherService.toKafka called but KafkaClientModule is not imported. ' +
          'Add `withKafka: true` to PublisherModule.forRoot({...}).',
      );
    }
    await firstValueFrom(this.kafka.emit(pattern, payload));
    this.logger.debug(`kafka.emit pattern=${pattern}`);
  }

  /**
   * Publish a JSON-serialised payload to a Google Cloud Pub/Sub topic.
   * Returns the message id or `null` if the publish failed (the underlying
   * client logs the error).
   */
  async toPubSub(topic: string, payload: unknown): Promise<string | null> {
    if (!this.pubsub) {
      throw new Error(
        'PublisherService.toPubSub called but PubSubModule is not imported. ' +
          'Add `withPubSub: true` to PublisherModule.forRoot({...}).',
      );
    }
    const messageId = await this.pubsub.publish(topic, payload);
    this.logger.debug(`pubsub.publish topic=${topic} messageId=${messageId}`);
    return messageId;
  }

  /**
   * Enqueue a typed Bull job. Generics lock the job + payload to the
   * contract declared in `libs/queue/src/queue.constants.ts`.
   */
  async toQueue<Q extends QueueName, J extends QueueJobName<Q>>(
    queueName: Q,
    jobName: J,
    payload: QueueJobPayload<Q, J>,
    options?: JobOptions,
  ): Promise<Job> {
    if (!this.queue) {
      throw new Error(
        'PublisherService.toQueue called but QueueProducerModule is not imported. ' +
          'Pass `queues: [...]` to PublisherModule.forRoot({...}).',
      );
    }
    return this.queue.enqueue(queueName, jobName, payload, options);
  }
}
