import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CorrelationService } from '@app/logger';

import { TasksService } from '../tasks/tasks.service';

/**
 * Cron service is intentionally thin: every schedule simply asks the
 * `TasksService` to enqueue a job onto a Bull queue (or fan out to
 * kafka / pub/sub). Each tick runs inside a fresh correlation context
 * so the resulting log lines — through this service, the publisher,
 * and eventually the downstream consumer — share one id.
 */
@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly correlation: CorrelationService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async tickReports() {
    await this.correlation.runWithNew('cron:tickReports', async () => {
      this.logger.log('tickReports fired');
      await this.tasksService.handleReportTick('cron:tickReports');
    });
  }
}
