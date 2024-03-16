import { Module } from '@nestjs/common';

import { GCloudPubSubModule } from 'src/utils/gcloudPubSub/gcloudPubSub.module';
import { GCloudPubsubRegistryService } from './gcloudPubsubRegistry.service';
import { GCloudPubSubRegistryController } from './gcloudPubsubRegistry.controller';

@Module({
  imports: [GCloudPubSubModule],
  providers: [GCloudPubsubRegistryService],
  controllers: [GCloudPubSubRegistryController],
  exports: [GCloudPubsubRegistryService],
})
export class GCloudPubSubRegistryModule {}
