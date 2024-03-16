import { Controller, Get } from '@nestjs/common';

import { BullQueueConsumerService } from './bullQueueConsumer.service';

@Controller('bullqueue')
export class BullQueueConsumerController {
  constructor(
    private readonly bullQueueConsumerService: BullQueueConsumerService,
  ) {}

  @Get('/push-to-reports-queue')
  pushToReportsQueue(): any {
    return this.bullQueueConsumerService.pushToReportsQueue();
  }
}
