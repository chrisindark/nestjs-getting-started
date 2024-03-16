import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

const defaultJobOptions = {
  removeOnComplete: true,
  removeOnFail: true,
};

@Injectable()
export class BullQueueConsumerService {
  private readonly logger = new Logger(BullQueueConsumerService.name);

  constructor(
    @InjectQueue('ReportsQueueConsumer')
    private reportsQueueConsumer: Queue,
  ) {}

  async pushToReportsQueue(): Promise<any> {
    try {
      const response = await this.reportsQueueConsumer.add(
        'reportsQueue',
        { hello: 'world' },
        defaultJobOptions,
      );

      return {
        success: true,
        response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);

      throw new Error(e.message);
    }
  }
}
