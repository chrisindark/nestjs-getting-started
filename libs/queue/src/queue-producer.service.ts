import { Inject, Injectable, Logger } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bull';
import { JobOptions, Queue } from 'bull';
import { ModuleRef } from '@nestjs/core';

import {
  DEFAULT_JOB_OPTIONS,
  QueueJobName,
  QueueJobPayload,
  QueueName,
} from './queue.constants';

export const QUEUE_PRODUCER_REGISTERED = Symbol('QUEUE_PRODUCER_REGISTERED');

/**
 * Typed wrapper around `Queue.add(...)`. The generic parameters lock the
 * job name + payload to the contract declared in `queue.constants.ts`,
 * so calling `enqueue(QueueName.Reports, JobName.GenerateReport, { ... })`
 * fails to compile if the payload shape drifts.
 */
@Injectable()
export class QueueProducerService {
  private readonly logger = new Logger(QueueProducerService.name);

  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject(QUEUE_PRODUCER_REGISTERED)
    private readonly registered: readonly QueueName[],
  ) {}

  async enqueue<Q extends QueueName, J extends QueueJobName<Q>>(
    queueName: Q,
    jobName: J,
    payload: QueueJobPayload<Q, J>,
    options: JobOptions = {},
  ) {
    if (!this.registered.includes(queueName)) {
      throw new Error(
        `Queue "${queueName}" was not registered with QueueProducerModule.register([...]). ` +
          `Add it to the producer's module to enqueue jobs.`,
      );
    }

    const queue = this.moduleRef.get<Queue>(getQueueToken(queueName), {
      strict: false,
    });

    const job = await queue.add(jobName, payload, {
      ...DEFAULT_JOB_OPTIONS,
      ...options,
    });

    this.logger.debug(
      `enqueued ${queueName}#${jobName} jobId=${job.id} payload=${JSON.stringify(payload)}`,
    );
    return job;
  }
}
