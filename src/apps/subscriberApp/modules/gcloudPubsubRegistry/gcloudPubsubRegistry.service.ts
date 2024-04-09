import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import * as moment from 'moment';
// import { validate, validateOrReject } from 'class-validator';

// import { MOMENT_DATETIME_FORMAT } from 'src/constants/constants';
// import { SentryService } from 'src/interceptors/sentry/sentry.service';
import { GCloudPubSubService } from 'src/utils/gcloudPubSub/gcloudPubSub.service';
import { UtilsService } from 'src/utils/utils.service';
import { AwsS3Service } from 'src/utils/awsS3/awsS3.service';

@Injectable()
export class GCloudPubsubRegistryService {
  private readonly logger = new Logger(GCloudPubsubRegistryService.name);

  constructor(
    private readonly gcloudPubsubService: GCloudPubSubService,
    private readonly configService: ConfigService,
    // private readonly sentryService: SentryService,
    private readonly utilsService: UtilsService,
    private readonly awsS3Service: AwsS3Service,
  ) {
    this.registerAllPubsub();
  }

  registerAllPubsub = () => {
    this.registerTestPubSub();
  };

  subscriptionMessageHandler = async (message) => {
    try {
      // this.logger.log(`Received message ${message.id}:`);
      // this.logger.log(`Data: ${message.data}`);
      // this.logger.log(`Attributes: ${JSON.stringify(message.attributes)}`);

      try {
        // When the Promise resolves, the value is always AckResponses.Success,
        // signaling that the ack was accepted. Note that you may call this
        // method on a subscription without exactly-once delivery, but it will
        // always return AckResponses.Success.
        await message.ackWithResponse();
      } catch (e) {
        const ackError = e;
        this.logger.error(
          `Ack for message ${message.id} failed with error: ${ackError.errorCode}`,
        );
      }
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${GCloudPubsubRegistryService.name} subscriptionMessageHandler`,
      );
    }
  };

  registerTestPubSub = () => {
    const TEST_PUBSUB_SUBSCRIPTION_NAME_KEY = `GCLOUD_PUBSUB_TEST_SUBSCRIPTION`;
    const testPubsubSubscriptionName = this.configService.getOrThrow(
      TEST_PUBSUB_SUBSCRIPTION_NAME_KEY,
    );

    this.gcloudPubsubService.listenForMessages(
      testPubsubSubscriptionName,
      (message) => this.subscriptionMessageHandler(message),
    );
  };
}
