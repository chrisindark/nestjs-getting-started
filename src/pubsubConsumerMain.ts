import { bootstrapContextApp } from '@app/bootstrap';

import { PubSubConsumerAppModule } from './apps/pubsubConsumerApp/pubsubConsumerApp.module';

void bootstrapContextApp(PubSubConsumerAppModule, {
  appName: 'pubsub-consumer',
});
