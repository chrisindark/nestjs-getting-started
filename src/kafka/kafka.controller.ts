import { Controller, Get } from "@nestjs/common";

import { KafkaService } from "./kafka.service";

@Controller("api/v1/kafka")
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Get("/publish")
  async publishMessage(): Promise<any> {
    const res = await this.kafkaService.publishMessage("firstTopic", {
      value: '{"hello":"world"}',
    });
    return res;
  }
}
