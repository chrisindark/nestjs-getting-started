import { Module } from "@nestjs/common";

import { GCloudSubscriberService } from "src/modules/gcloudSubscriber/gcloudSubscriber.service";
import { GCloudSubscriberController } from "src/modules/gcloudSubscriber/gcloudSubscriber.controller";

@Module({
  imports: [],
  providers: [GCloudSubscriberService],
  controllers: [GCloudSubscriberController],
})
export class GCloudSubscriberModule {}
