import { Injectable, Logger } from '@nestjs/common';

import { BullQueueConsumerService } from 'src/utils/bull/bullQueueConsumer.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly utilsService: UtilsService,
    private readonly bullQueueConsumerService: BullQueueConsumerService,
  ) {}

  handleTask() {
    this.logger.debug('Task called when the current second is 30');
  }
}
