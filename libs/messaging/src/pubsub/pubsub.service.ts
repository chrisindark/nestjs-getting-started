import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message, PubSub, Subscription } from '@google-cloud/pubsub';

import { PubSubIncomingMessage, PubSubMessageHandler } from './pubsub.types';

@Injectable()
export class PubSubService implements OnApplicationShutdown {
  private readonly logger = new Logger(PubSubService.name);
  private readonly client: PubSub;
  private readonly subscriptions = new Map<string, Subscription>();

  constructor(private readonly configService: ConfigService) {
    this.client = new PubSub({
      projectId: this.configService.get<string>('GCLOUD_PROJECT_ID'),
    });
  }

  async publish(topic: string, payload: unknown): Promise<string | null> {
    try {
      const data = Buffer.from(JSON.stringify(payload));
      return await this.client.topic(topic).publishMessage({ data });
    } catch (e) {
      this.logger.error(
        `publish to ${topic} failed: ${(e as Error).message}`,
        (e as Error).stack,
      );
      return null;
    }
  }

  /**
   * Subscribe to a Pub/Sub subscription. The handler MUST decide when to
   * `ack` / `nack` — the bridge layer is responsible for that, not this
   * client. Returns the underlying subscription so callers can close it.
   */
  listen(
    subscriptionName: string,
    handler: PubSubMessageHandler,
  ): Subscription {
    const subscription = this.client.subscription(subscriptionName);

    subscription.on('message', async (message: Message) => {
      try {
        await handler(this.toIncoming(message));
      } catch (e) {
        this.logger.error(
          `handler for ${subscriptionName} threw: ${(e as Error).message}`,
          (e as Error).stack,
        );
        message.nack();
      }
    });

    subscription.on('error', (e) => {
      this.logger.error(
        `subscription ${subscriptionName} error: ${e.message}`,
        e.stack,
      );
    });

    this.subscriptions.set(subscriptionName, subscription);
    this.logger.log(`listening on subscription "${subscriptionName}"`);
    return subscription;
  }

  async onApplicationShutdown(): Promise<void> {
    for (const [name, sub] of this.subscriptions) {
      try {
        await sub.close();
        this.logger.log(`closed subscription "${name}"`);
      } catch (e) {
        this.logger.warn(
          `failed to close subscription "${name}": ${(e as Error).message}`,
        );
      }
    }
  }

  private toIncoming(message: Message): PubSubIncomingMessage {
    return {
      id: message.id,
      data: message.data,
      attributes: message.attributes,
      publishTime: message.publishTime,
      ack: () => message.ack(),
      nack: () => message.nack(),
      ackWithResponse: () => message.ackWithResponse(),
    };
  }
}
