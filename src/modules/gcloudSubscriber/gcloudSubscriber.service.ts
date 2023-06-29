import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { promisify } from "util";

import { GCloudPubSubService } from "src/utils/gcloudPubSub/gcloudPubSub.service";

@Injectable()
export class GCloudSubscriberService {
  constructor(
    private readonly configService: ConfigService,
    private readonly gcloudPubSubService: GCloudPubSubService,
  ) {
    // subscribe to the subscription topic on class instantiation if subscriber service is activated
  }

  subscriptionMessageHandler = async (message) => {
    try {
      Logger.log(`Received message ${message.id}:`);
      Logger.log(`Data: ${message.data}`);
      Logger.log(`Attributes: ${JSON.stringify(message.attributes)}`);

      let result = false;
      await promisify(setTimeout)(10000);
      result = true;
      //   const data = JSON.parse(message.data);
      //   Logger.log('data', data);

      if (result) {
        // Use `ackWithResponse()` instead of `ack()` to get a Promise that tracks
        // the result of the acknowledge call. When exactly-once delivery is enabled
        // on the subscription, the message is guaranteed not to be delivered again
        // if the ack Promise resolves.

        try {
          // When the Promise resolves, the value is always AckResponses.Success,
          // signaling that the ack was accepted. Note that you may call this
          // method on a subscription without exactly-once delivery, but it will
          // always return AckResponses.Success.
          //   message.ack();
          const ackResponse = await message.ackWithResponse();
          Logger.log(`Ack for message ${message.id} successful ${ackResponse}`);
        } catch (e) {
          // In all other cases, the error passed on reject will explain why. This
          // is only for permanent failures; transient errors are retried automatically.
          const ackError = e;
          Logger.log(
            `Ack for message ${message.id} failed with error: ${ackError.errorCode}`,
          );
        }
      }
    } catch (e) {
      Logger.error(e, "", "ERROR_MESSAGE_HANDLER");
    }
  };

  async subscribeMessage() {
    const subscriptionName = this.configService.get(
      "GCLOUD_PUBSUB_TEST_SUBSCRIPTION",
    );
    // const topicName = this.configService.get('GCLOUD_PUBSUB_TEST_TOPIC');
    const subscription = this.gcloudPubSubService.listenForMessages(
      subscriptionName,
      this.subscriptionMessageHandler,
      //   topicName,
    );
    // Logger.log(subscription);

    return {
      success: true,
    };
  }
}
