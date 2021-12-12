import {
  Injectable,
  Logger,
  OnModuleInit,
  Inject,
  OnApplicationShutdown,
  OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from "@nestjs/microservices";
import { Producer } from "@nestjs/microservices/external/kafka.interface";
import Utils from "src/utils";

@Injectable()
export class KafkaConsumerService
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor() {}

  async onModuleInit() {}

  async onModuleDestroy() {}

  async onApplicationShutdown(signal?: string) {}
}
