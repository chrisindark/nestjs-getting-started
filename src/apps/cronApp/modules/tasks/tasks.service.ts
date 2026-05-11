import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PublisherService } from '@app/publisher';
import { JobName, QueueName } from '@app/queue';

/**
 * Cron-side dispatcher. Each `handle*` decides which transport (Bull
 * queue, Kafka, Pub/Sub) the work belongs on and publishes via the
 * single `PublisherService` facade.
 */
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly publisher: PublisherService) {}

  async handleReportTick(actor = 'cron') {
    const job = await this.publisher.toQueue(
      QueueName.Reports,
      JobName.GenerateReport,
      {
        reportId: randomUUID(),
        triggeredAt: new Date().toISOString(),
        actor,
      },
    );
    this.logger.debug(`enqueued report jobId=${job.id}`);
    return job.id;
  }

  /**
   * Demo: emit a Kafka event from the cron schedule. Lets you exercise
   * the kafka-consumer pipeline without an external producer.
   */
  async emitDemoKafkaEvent() {
    await this.publisher.toKafka('demo.first-topic', {
      triggeredAt: new Date().toISOString(),
      actor: 'cron:emitDemoKafkaEvent',
    });
    this.logger.debug('emitted demo.first-topic via kafka');
  }
}
