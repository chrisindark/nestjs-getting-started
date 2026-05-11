import { Module } from '@nestjs/common';

import { PubSubModule } from '@app/messaging';

import { GCloudSubscriberService } from './gcloudSubscriber.service';
import { GCloudSubscriberController } from './gcloudSubscriber.controller';

@Module({
  imports: [PubSubModule],
  providers: [GCloudSubscriberService],
  controllers: [GCloudSubscriberController],
})
export class GCloudSubscriberModule {}
