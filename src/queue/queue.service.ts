import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue("CronQueueConsumer")
    private cronQueueConsumer: Queue,
    @InjectQueue("KafkaQueueConsumer")
    private kafkaQueueConsumer: Queue,
  ) {}

  async getFromCronQueue(): Promise<any> {
    const response = await this.cronQueueConsumer.add(
      "getFromCronQueue",
      { hello: "world" },
      {
        removeOnComplete: true,
      },
    );

    return {
      success: true,
      response,
    };
  }

  async getFromKafkaQueue(): Promise<any> {
    const response = await this.kafkaQueueConsumer.add(
      "getFromKafkaQueue",
      { hello: "world" },
      {
        removeOnComplete: true,
      },
    );

    return {
      success: true,
      response,
    };
  }
}
