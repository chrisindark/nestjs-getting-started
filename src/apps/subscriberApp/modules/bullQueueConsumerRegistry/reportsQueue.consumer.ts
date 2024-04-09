import {
  InjectQueue,
  OnGlobalQueueActive,
  OnGlobalQueueCompleted,
  OnGlobalQueueError,
  OnGlobalQueueFailed,
  OnGlobalQueueProgress,
  OnGlobalQueueStalled,
  OnGlobalQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Injectable()
@Processor('ReportsQueueConsumer')
export class ReportsQueueConsumer {
  private readonly logger = new Logger(ReportsQueueConsumer.name);

  constructor(
    @InjectQueue(ReportsQueueConsumer.name)
    private readonly reportsQueueConsumer: Queue,
  ) {}

  @OnGlobalQueueError()
  onQueueError(e: Error) {
    this.logger.error(e.message, e.stack);
  }

  @OnGlobalQueueWaiting()
  async onQueueWaiting(jobId: number | string) {
    const job = await this.reportsQueueConsumer.getJob(jobId);
    if (!job) {
      return;
    }

    this.logger.debug(
      `WAITING: ${ReportsQueueConsumer.name} - ${job?.name} - JOB ID: ${jobId}`,
    );
  }

  @OnGlobalQueueActive()
  async onQueueActive(jobId: number) {
    const job = await this.reportsQueueConsumer.getJob(jobId);
    if (!job) {
      return;
    }

    this.logger.debug(
      `ACTIVE: ${ReportsQueueConsumer.name} - ${job?.name} - JOB ID: ${jobId}`,
    );
  }

  @OnGlobalQueueStalled()
  async OnQueueStalled(jobId: number) {
    const job = await this.reportsQueueConsumer.getJob(jobId);
    if (!job) {
      return;
    }

    this.logger.debug(
      `STALLED: ${ReportsQueueConsumer.name} - ${job?.name} - JOB ID: ${jobId}`,
    );
  }

  @OnGlobalQueueProgress()
  async onQueueProgress(jobId: number, progress: number) {
    const job = await this.reportsQueueConsumer.getJob(jobId);
    if (!job) {
      return;
    }

    this.logger.debug(
      `PROGRESS: ${ReportsQueueConsumer.name} - ${job?.name} - JOB ID: ${jobId} - progress: ${progress}`,
    );
  }

  @OnGlobalQueueCompleted()
  async onQueueCompleted(jobId: number, result: any) {
    const job = await this.reportsQueueConsumer.getJob(jobId);
    if (!job) {
      return;
    }

    this.logger.log(result);
    this.logger.debug(
      `COMPLETED: ${ReportsQueueConsumer.name} - ${job.name} - JOB ID: ${job.id}`,
    );
  }

  @OnGlobalQueueFailed()
  async onQueueFailed(jobId: number, e: Error) {
    const job = await this.reportsQueueConsumer.getJob(jobId);
    if (!job) {
      return;
    }

    this.logger.error(e.message);
    this.logger.debug(
      `FAILED: ${ReportsQueueConsumer.name} - ${job.name} - JOB ID: ${jobId}`,
    );
  }

  @Process('reportsQueue')
  async reportsQueueMessageHandler(job: Job) {
    this.logger.log(
      `reportsQueueMessageHandler job data: ${JSON.stringify(job.data)}`,
    );
    return { success: true };
  }
}
