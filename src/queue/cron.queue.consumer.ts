import {
  InjectQueue,
  OnGlobalQueueActive,
  OnGlobalQueueCompleted,
  OnGlobalQueueError,
  OnGlobalQueueFailed,
  OnGlobalQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bull';
import { promisify } from 'util';

@Injectable()
@Processor('CronQueueConsumer')
export class CronQueueConsumer {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(CronQueueConsumer.name)
    private readonly cronQueueConsumer: Queue,
  ) {}

  @OnGlobalQueueError()
  onQueueError(err: Error) {
    // const options = {
    //   custom: {
    //     event: "ERROR",
    //     queue: CronQueueConsumer.name,
    //     error: err,
    //   },
    // };
    // console.log(`ERROR: ${err}`);
  }

  @OnGlobalQueueFailed()
  async onQueueFailed(jobId: number, err: Error) {
    const job = await this.cronQueueConsumer.getJob(jobId);

    // const options = {
    //   custom: {
    //     event: "FAILED",
    //     queue: CronQueueConsumer.name,
    //     job: job.name,
    //     error: err,
    //     jobId,
    //   },
    // };

    // console.log(
    //   `FAILED: ${CronQueueConsumer.name} - ${job.name} - JOB ID: ${jobId}`,
    // );
  }

  @OnGlobalQueueActive()
  async onQueueActive(jobId: number, result: any) {
    const job = await this.cronQueueConsumer.getJob(jobId);
    // const error = new Error(
    //   `${CronQueueConsumer.name} - ${job.name} - ${jobId}`,
    // );

    // const options = {
    //   custom: {
    //     event: "ACTIVE",
    //     queue: CronQueueConsumer.name,
    //     job: job.name,
    //     jobId,
    //     error,
    //   },
    // };

    // console.log(
    //   `ACTIVE: ${CronQueueConsumer.name} - ${job.name} - JOB ID: ${jobId}`,
    // );
  }

  @OnGlobalQueueCompleted()
  async onQueueCompleted(jobId: number, result: any) {
    const job = await this.cronQueueConsumer.getJob(jobId);
    // const error = new Error(
    //   `${CronQueueConsumer.name} - ${job.name} - ${jobId}`,
    // );

    // const options = {
    //   custom: {
    //     event: "COMPLETED",
    //     queue: CronQueueConsumer.name,
    //     job: job.name,
    //     jobId,
    //     error,
    //     result,
    //   },
    // };

    // console.log(
    //   `COMPLETED: ${CronQueueConsumer.name} - ${job.name} - JOB ID: ${jobId}`,
    // );
  }

  @OnGlobalQueueWaiting()
  async onQueueWaiting(jobId: number) {
    const job = await this.cronQueueConsumer.getJob(jobId);
    // const error = new Error(
    //   `${CronQueueConsumer.name} - ${job.name} - ${jobId}`,
    // );

    // const options = {
    //   custom: {
    //     event: "WAITING",
    //     queue: CronQueueConsumer.name,
    //     job: job.name,
    //     jobId,
    //     error,
    //   },
    // };

    // console.log(
    //   `WAITING: ${CronQueueConsumer.name} - ${job.name} - JOB ID: ${jobId}`,
    // );
  }

  @Process('getFromCronQueue')
  async getFromCronQueue(job: Job) {
    console.log('getFromCronQueue 30s timeout started', job.data);
    await promisify(setTimeout)(30000);
    console.log('getFromCronQueue 30s timeout ended');
  }
}
