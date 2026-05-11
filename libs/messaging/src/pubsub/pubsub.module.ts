import { Global, Module } from '@nestjs/common';

import { PubSubService } from './pubsub.service';

/**
 * Provides `PubSubService` globally. Import once at the root of any app
 * that needs to publish to or subscribe from Google Cloud Pub/Sub.
 */
@Global()
@Module({
  providers: [PubSubService],
  exports: [PubSubService],
})
export class PubSubModule {}
