import { Module } from '@nestjs/common';

import { PubSubModule } from '@app/messaging';

import { GCloudPublisherService } from './gcloudPublisher.service';
import { GCloudPublisherController } from './gcloudPublisher.controller';

@Module({
  imports: [PubSubModule],
  providers: [GCloudPublisherService],
  controllers: [GCloudPublisherController],
  exports: [GCloudPublisherService],
})
export class GCloudPublisherModule {}
