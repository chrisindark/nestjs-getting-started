import { Module } from '@nestjs/common';

import { BullQueueConsumerRegistryService } from './bullQueueConsumerRegistry.service';
import { BullQueueConsumerRegistryController } from './bullQueueConsumerRegistry.controller';
import { ReportsQueueConsumer } from './reportsQueue.consumer';

@Module({
  imports: [],
  controllers: [BullQueueConsumerRegistryController],
  providers: [BullQueueConsumerRegistryService, ReportsQueueConsumer],
  exports: [BullQueueConsumerRegistryService],
})
export class BullQueueConsumerRegistryModule {}
