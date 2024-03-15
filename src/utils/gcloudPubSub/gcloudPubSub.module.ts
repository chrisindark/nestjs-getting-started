import { Global, Module } from '@nestjs/common';

import { GCloudPubSubService } from './gcloudPubSub.service';

@Global()
@Module({
  imports: [],
  providers: [GCloudPubSubService],
  exports: [GCloudPubSubService],
})
export class GCloudPubSubModule {}
