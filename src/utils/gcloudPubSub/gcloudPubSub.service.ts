import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class GCloudPubSubService {
  private pubSubClient: PubSub;
  private readonly projectId;

  constructor(private readonly configService: ConfigService) {
    this.projectId = this.configService.get('GCLOUD_PROJECT_ID');
    this.connect();
  }

  connect = async () => {
    try {
      this.pubSubClient = new PubSub({
        projectId: this.projectId,
      });
    } catch (e) {
      // Logger.error(e, '', 'GCLOUDPUBSUB');
    }
  };

  publishMessage = async (topicNameOrId: string, payload: any) => {
    try {
      const dataBuffer = Buffer.from(JSON.stringify(payload));
      const messageId = await this.pubSubClient
        .topic(topicNameOrId)
        .publishMessage({ data: dataBuffer });
      // Logger.log(`Message ${messageId} published`, '');
      return messageId;
    } catch (e) {
      Logger.error(e, '', 'GCLOUDPUBSUB');
      return null;
    }
  };

  listenForMessages = async (
    subscriptionNameOrId: string,
    messageHandler: any,
    // topicNameOrId?: string,
  ) => {
    try {
      // if (topicNameOrId) {
      // await this.pubSubClient
      //   .topic(topicNameOrId)
      //   .createSubscription(subscriptionNameOrId, {
      //     enableExactlyOnceDelivery: true,
      //     enableMessageOrdering: true,
      //   });
      // Logger.log(
      //   `Created subscription ${subscriptionNameOrId} with exactly-once delivery and ordering enabled.`,
      // );
      // Logger.log(
      //   `To process messages, remember to check the return value of ackWithResponse().`,
      // );
      // } else {
      const subscription = this.pubSubClient.subscription(subscriptionNameOrId);

      // Receive callbacks for new messages on the subscription
      subscription.on('message', messageHandler);

      // Receive callbacks for errors on the subscription
      subscription.on('error', (e) => {
        Logger.error(`Received error: ${e}`, '', 'GCLOUDPUBSUB');
      });

      return subscription;
      // }
    } catch (e) {
      Logger.error(e, '', 'GCLOUDPUBSUB');
      return null;
    }
  };

  async publishMessageToTestTopic() {
    const topicName = this.configService.get('GCLOUD_PUBSUB_TEST_TOPIC');
    const gcloudTestPayload = {
      type: 'hello',
      message: 'world',
    };
    const messageId = await this.publishMessage(topicName, gcloudTestPayload);

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
