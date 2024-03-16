import { Injectable, Logger } from '@nestjs/common';

import { BullQueueConsumerService } from 'src/utils/bull/bullQueueConsumer.service';

@Injectable()
export class BullQueueConsumerRegistryService {
  private readonly logger = new Logger(BullQueueConsumerRegistryService.name);

  constructor(
    private readonly bullQueueConsumerService: BullQueueConsumerService,
  ) {}
}
