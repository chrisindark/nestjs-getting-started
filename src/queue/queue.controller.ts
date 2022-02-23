import { Controller, Get } from "@nestjs/common";

import { CronQueueConsumer } from "./cron.queue.consumer";
import { KafkaQueueConsumer } from "./kafka.queue.consumer";

@Controller("api/v1/queue")
export class QueueController {
  constructor(
    private readonly cronQueueConsumer: CronQueueConsumer,
    private readonly kafkaQueueConsumer: KafkaQueueConsumer,
  ) {}

  @Get("/get-from-cron-queue")
  getFromCronQueue(): any {
    return {};
  }

  @Get("/get-from-kafka-queue")
  getFromKafkaQueue(): any {
    return {};
  }
}
