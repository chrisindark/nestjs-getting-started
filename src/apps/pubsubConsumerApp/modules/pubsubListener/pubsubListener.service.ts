import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PubSubIncomingMessage, PubSubService } from '@app/messaging';

/**
 * Subscribes to Google Cloud Pub/Sub subscriptions and processes messages
 * directly. If you need durable retries / DLQ behaviour for a particular
 * subscription, inject `PublisherService` and call `toQueue(...)` from the
 * handler — the queue consumer app will then own retries.
 *
 * Subscriptions come from `PUBSUB_SUBSCRIPTIONS` (comma-separated) or, for
 * backwards compatibility, `GCLOUD_PUBSUB_TEST_SUBSCRIPTION`.
 */
@Injectable()
export class PubSubListenerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PubSubListenerService.name);

  constructor(
    private readonly pubsub: PubSubService,
    private readonly config: ConfigService,
  ) {}

  onApplicationBootstrap(): void {
    const subscriptions = this.subscriptionsFromEnv();
    if (subscriptions.length === 0) {
      this.logger.warn('no Pub/Sub subscriptions configured; consumer is idle');
      return;
    }
    for (const subscription of subscriptions) {
      this.pubsub.listen(subscription, (msg) => this.handle(subscription, msg));
    }
  }

  private async handle(subscription: string, message: PubSubIncomingMessage) {
    try {
      const body = this.safeParseJson(message.data);
      this.logger.log(
        `pubsub message from ${subscription} id=${message.id} body=${JSON.stringify(body)}`,
      );

      // TODO: route on `subscription` / `message.attributes` and do the work.
      //       Throw to nack and have the source redeliver.

      if (message.ackWithResponse) {
        await message.ackWithResponse();
      } else {
        message.ack();
      }
    } catch (e) {
      this.logger.error(
        `handler for ${subscription} message ${message.id} threw: ${(e as Error).message}`,
        (e as Error).stack,
      );
      message.nack();
    }
  }

  private subscriptionsFromEnv(): string[] {
    const csv = this.config.get<string>('PUBSUB_SUBSCRIPTIONS');
    if (csv) {
      return csv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const legacy = this.config.get<string>('GCLOUD_PUBSUB_TEST_SUBSCRIPTION');
    return legacy ? [legacy] : [];
  }

  private safeParseJson(buffer: Buffer): unknown {
    if (!buffer || buffer.length === 0) return null;
    const text = buffer.toString('utf8');
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
}
