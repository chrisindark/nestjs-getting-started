import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly tasksService: TasksService) {}

  @Cron('*/5 * * * * *')
  handleCron() {
    this.logger.log('Cron called');
    this.tasksService.handleTask();
  }
}
