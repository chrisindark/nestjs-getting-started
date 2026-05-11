import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueStalled,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { CorrelationService, correlationFromBullJob } from '@app/logger';
import { JobName, QueueName, ReportsQueueJobs } from '@app/queue';

@Processor(QueueName.Reports)
export class ReportsQueueProcessor {
  private readonly logger = new Logger(ReportsQueueProcessor.name);

  constructor(private readonly correlation: CorrelationService) {}

  @Process(JobName.GenerateReport)
  async generateReport(job: Job<ReportsQueueJobs[JobName.GenerateReport]>) {
    return this.correlation.runWithIncoming(
      correlationFromBullJob(job),
      `queue:${QueueName.Reports}#${job.name}`,
      async () => {
        this.logger.log(
          `processing ${QueueName.Reports}#${job.name} jobId=${job.id} ` +
            `payload=${JSON.stringify(job.data)}`,
        );

        // TODO: real report-generation work goes here. Throw to fail the job
        //       (Bull will retry per DEFAULT_JOB_OPTIONS.attempts).

        return { success: true, reportId: job.data.reportId };
      },
    );
  }

  @OnQueueWaiting()
  onWaiting(jobId: number | string) {
    this.logger.debug(`WAITING jobId=${jobId}`);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`ACTIVE jobId=${job.id} name=${job.name}`);
  }

  @OnQueueStalled()
  onStalled(job: Job) {
    this.logger.warn(`STALLED jobId=${job.id} name=${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: unknown) {
    this.correlation.runWithIncoming(
      correlationFromBullJob(job),
      `queue:${QueueName.Reports}#${job.name}`,
      () => {
        this.logger.log(
          `COMPLETED jobId=${job.id} name=${job.name} result=${JSON.stringify(result)}`,
        );
      },
    );
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.correlation.runWithIncoming(
      correlationFromBullJob(job),
      `queue:${QueueName.Reports}#${job.name}`,
      () => {
        this.logger.error(
          `FAILED jobId=${job.id} name=${job.name} reason=${err.message}`,
          err.stack,
        );
      },
    );
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(`QUEUE ERROR ${err.message}`, err.stack);
  }
}
