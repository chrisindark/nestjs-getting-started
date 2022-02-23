import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { QueueService } from "src/queue/queue.service";

@Injectable()
export class CronService {
  constructor(private readonly queueService: QueueService) {}

  async cron() {
    return { success: true };
  }

  @Cron("0 * * * * *", {
    name: "getFromCronQueue",
  })
  getFromCronQueueOne() {
    this.getFromCronQueue();
  }

  async getFromCronQueue() {
    // console.log(`getFromCronQueue Cron started at ${new Date()}`);

    const res = await this.queueService.getFromCronQueue();
    // if (res.success) {
    //   console.log(`populateUgcTrails Cron ended at ${new Date()}`);
    // }
  }

  @Cron("0 * * * * *", {
    name: "getFromKafkaQueue",
  })
  getFromKafkaQueueOne() {
    this.getFromKafkaQueue();
  }

  async getFromKafkaQueue() {
    // console.log(`getFromKafkaQueue Cron started at ${new Date()}`);

    const res = await this.queueService.getFromKafkaQueue();
    // if (res.success) {
    //   console.log(`getFromKafkaQueue Cron ended at ${new Date()}`);
    // }
  }
}
