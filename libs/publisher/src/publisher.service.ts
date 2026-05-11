import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import type { ClientKafka } from '@nestjs/microservices';
import type { Job, JobOptions } from 'bull';
import { firstValueFrom } from 'rxjs';

import {
  CorrelationService,
  withBullCorrelation,
  withKafkaCorrelation,
  withPubSubCorrelation,
} from '@app/logger';
import { KAFKA_CLIENT, PubSubService } from '@app/messaging';
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
 * Each call also automatically attaches the current correlation id from
 * AsyncLocalStorage to the transport-specific slot (kafka headers,
 * pubsub attributes, bull job meta), so downstream consumers can pick it
 * up without callers thinking about it.
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
    private readonly correlation: CorrelationService,
    @Optional() @Inject(KAFKA_CLIENT) private readonly kafka?: ClientKafka,
    @Optional() private readonly pubsub?: PubSubService,
    @Optional() private readonly queue?: QueueProducerService,
  ) {}

  /**
   * Emit a fire-and-forget Kafka event. The pattern (topic name) and
   * payload format must match what a consumer's `@EventPattern(pattern)`
   * expects. Correlation id is attached as the `x-correlation-id`
   * message header.
   */
  async toKafka(pattern: string, payload: unknown): Promise<void> {
    if (!this.kafka) {
      throw new Error(
        'PublisherService.toKafka called but KafkaClientModule is not imported. ' +
          'Add `withKafka: true` to PublisherModule.forRoot({...}).',
      );
    }
    const message = withKafkaCorrelation(
      payload,
      this.correlation.getCorrelationId(),
    );
    await firstValueFrom(this.kafka.emit(pattern, message));
    this.logger.debug(`kafka.emit pattern=${pattern}`);
  }

  /**
   * Publish a JSON-serialised payload to a Google Cloud Pub/Sub topic.
   * Correlation id is attached as the `correlationId` attribute.
   * Returns the message id or `null` if the publish failed (the
   * underlying client logs the error).
   */
  async toPubSub(topic: string, payload: unknown): Promise<string | null> {
    if (!this.pubsub) {
      throw new Error(
        'PublisherService.toPubSub called but PubSubModule is not imported. ' +
          'Add `withPubSub: true` to PublisherModule.forRoot({...}).',
      );
    }
    const attributes = withPubSubCorrelation(
      undefined,
      this.correlation.getCorrelationId(),
    );
    const messageId = await this.pubsub.publish(topic, payload, { attributes });
    this.logger.debug(`pubsub.publish topic=${topic} messageId=${messageId}`);
    return messageId;
  }

  /**
   * Enqueue a typed Bull job. Generics lock the job + payload to the
   * contract declared in `libs/queue/src/queue.constants.ts`.
   * Correlation id is tunnelled through `job.data.__meta.correlationId`
   * — the typed payload itself is untouched.
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
    const enriched = withBullCorrelation(
      payload as Record<string, unknown>,
      this.correlation.getCorrelationId(),
    ) as QueueJobPayload<Q, J>;
    return this.queue.enqueue(queueName, jobName, enriched, options);
  }
}
