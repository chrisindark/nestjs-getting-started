import { Module } from "@nestjs/common";

import { GCloudPublisherService } from "src/modules/gcloudPublisher/gcloudPublisher.service";
import { GCloudPublisherController } from "src/modules/gcloudPublisher/gcloudPublisher.controller";
import { GCloudPubSubModule } from "src/utils/gcloudPubSub/gcloudPubSub.module";

@Module({
  imports: [GCloudPubSubModule],
  providers: [GCloudPublisherService],
  controllers: [GCloudPublisherController],
  exports: [GCloudPublisherService],
})
export class GCloudPublisherModule {}
