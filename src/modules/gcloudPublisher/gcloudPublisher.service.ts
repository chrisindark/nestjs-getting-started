import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GCloudPubSubService } from "src/utils/gcloudPubSub/gcloudPubSub.service";

@Injectable()
export class GCloudPublisherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly gcloudPubSubService: GCloudPubSubService,
  ) {}

  // central function to publish messages to glcoud if publisher service is activated
  private publishMessage = async (topicName: string, payload: any) => {
    let messageId = null;

    messageId = await this.gcloudPubSubService.publishMessage(
      topicName,
      payload,
    );

    return messageId;
  };

  async publishMessageToTestTopic() {
    const topicName = this.configService.get("GCLOUD_PUBSUB_TEST_TOPIC");
    const gcloudTestPayload = {
      type: "hello",
      message: "world",
    };

    const messageId = await this.publishMessage(topicName, gcloudTestPayload);
    // Logger.log(messageId, '', '');

    return {
      message: messageId,
      success: true,
    };
  }
  async publishMessageTopic(topic, payload) {
    const messageId = await this.publishMessage(topic, payload);

    return {
      message: messageId,
      success: true,
    };
  }
}
