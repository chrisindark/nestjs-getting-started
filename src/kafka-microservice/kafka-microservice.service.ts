import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import Utils from 'src/utils';

@Injectable()
export class KafkaMicroserviceService
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor() {
    console.log('empty constructor');
  }

  async onModuleInit() {
    console.log('empty module init');
  }

  async onModuleDestroy() {
    console.log('empty module destroy');
  }

  async onApplicationShutdown(signal?: string) {
    console.log('empty application shutdown');
  }
}
