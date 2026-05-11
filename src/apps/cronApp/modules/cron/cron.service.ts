import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TasksService } from '../tasks/tasks.service';

/**
 * Cron service is intentionally thin: every schedule simply asks the
 * `TasksService` to enqueue a job onto a Bull queue. The actual work
 * happens in the consumer service.
 */
@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly tasksService: TasksService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async tickReports() {
    this.logger.log('tickReports fired');
    await this.tasksService.handleReportTick('cron:tickReports');
  }
}
