import { Controller } from '@nestjs/common';

import { BullQueueConsumerRegistryService } from './bullQueueConsumerRegistry.service';

@Controller('bull-queue-consumer-registry')
export class BullQueueConsumerRegistryController {
  constructor(
    private readonly bullQueueConsumerRegistryService: BullQueueConsumerRegistryService,
  ) {}
}
