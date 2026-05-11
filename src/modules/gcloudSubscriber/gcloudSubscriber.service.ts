import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PubSubIncomingMessage, PubSubService } from '@app/messaging';

/**
 * Demo subscriber kept in the API project to show how a service can pull
 * messages directly from a Pub/Sub subscription without going through the
 * subscriber + consumer bull-queue pipeline. Production workloads should
 * use the dedicated `pubsubConsumerApp`.
 */
@Injectable()
export class GCloudSubscriberService {
  private readonly logger = new Logger(GCloudSubscriberService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly pubsub: PubSubService,
  ) {}

  subscribeMessage() {
    const subscription = this.configService.get<string>(
      'GCLOUD_PUBSUB_TEST_SUBSCRIPTION',
    );
    if (!subscription) {
      this.logger.warn('GCLOUD_PUBSUB_TEST_SUBSCRIPTION not set; subscribe noop');
      return { success: false };
    }
    this.pubsub.listen(subscription, (msg) => this.handle(msg));
    return { success: true };
  }

  private async handle(message: PubSubIncomingMessage) {
    this.logger.log(`received message ${message.id}`);
    if (message.ackWithResponse) {
      await message.ackWithResponse();
    } else {
      message.ack();
    }
  }
}
