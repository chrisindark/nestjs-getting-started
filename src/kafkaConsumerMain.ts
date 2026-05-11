import { bootstrapMicroservice } from '@app/bootstrap';
import { buildKafkaTransport, kafkaBrokersFromEnv } from '@app/messaging';

import { KafkaConsumerAppModule } from './apps/kafkaConsumerApp/kafkaConsumerApp.module';

const appName = 'kafka-consumer';

void bootstrapMicroservice(KafkaConsumerAppModule, {
  appName,
  transport: buildKafkaTransport({
    clientId: process.env.APP_NAME ?? appName,
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID ?? `${appName}-group`,
    brokers: kafkaBrokersFromEnv(),
  }),
});
