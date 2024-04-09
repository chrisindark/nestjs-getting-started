import {
  InjectQueue,
  // OnGlobalQueueError,
  // OnGlobalQueueFailed,
  Process,
  Processor,
  // OnGlobalQueueWaiting,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bull';
import { promisify } from 'util';

@Injectable()
@Processor('KafkaQueueConsumer')
export class KafkaQueueConsumer {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(KafkaQueueConsumer.name)
    private readonly kafkaQueueConsumer: Queue,
  ) {}

  @Process('getFromKafkaQueue')
  async getFromKafkaQueue(job: Job) {
    console.log('getFromKafkaQueue 10s timeout started', job.data);
    await promisify(setTimeout)(10000);
    console.log('getFromKafkaQueue 10s timeout ended');
  }
}
