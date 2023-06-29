import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { GCloudPublisherService } from "src/modules/gcloudPublisher/gcloudPublisher.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

class CreateEntryDto {
  userid: number;
  email: string;
  fromDate: string;
  toDate: string;
  secondaryEmails: string[];
}

@Controller("gcloudpub")
export class GCloudPublisherController {
  constructor(
    private readonly gCloudPublisherService: GCloudPublisherService,
  ) {}

  @Get("/publish-message-to-test-topic")
  async publishMessage(): Promise<any> {
    return this.gCloudPublisherService.publishMessageToTestTopic();
  }

  @UseGuards(JwtAuthGuard)
  @Post("/publish/:topic")
  publishToTopic(@Param("topic") topic: string, @Req() req): any {
    Logger.log(`Pushed payload : ${JSON.stringify(req.body)} to ${topic}`);
    return this.gCloudPublisherService.publishMessageTopic(topic, req.body);
  }
}
