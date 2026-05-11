import { Module } from '@nestjs/common';

import { AppConfigModule } from '@app/config';
import { AppLoggerModule } from '@app/logger';

import { PubSubListenerModule } from './modules/pubsubListener/pubsubListener.module';

/**
 * Standalone consumer service for Google Cloud Pub/Sub. Owns every
 * subscription handler. Bootstraps without an HTTP server.
 */
@Module({
  imports: [
    AppConfigModule.forRoot(),
    AppLoggerModule.forRoot({ appName: 'pubsub-consumer' }),
    PubSubListenerModule,
  ],
})
export class PubSubConsumerAppModule {}
