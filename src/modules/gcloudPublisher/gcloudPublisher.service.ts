import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PubSubService } from '@app/messaging';

@Injectable()
export class GCloudPublisherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly pubsub: PubSubService,
  ) {}

  async publishMessageTopic(topic: string, payload: unknown) {
    const messageId = await this.pubsub.publish(topic, payload);
    return { message: messageId, success: Boolean(messageId) };
  }

  async publishMessageToTestTopic() {
    const topic = this.configService.get<string>('GCLOUD_PUBSUB_TEST_TOPIC');
    if (!topic) {
      return { message: null, success: false };
    }
    return this.publishMessageTopic(topic, { type: 'hello', message: 'world' });
  }
}
