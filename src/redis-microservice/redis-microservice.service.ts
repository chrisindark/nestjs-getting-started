import {
  Injectable,
  Logger,
  OnModuleInit,
  Inject,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientRedis,
  Ctx,
  EventPattern,
  RedisContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import {} from '@nestjs/microservices/external/redis.interface';
import Utils from 'src/utils';

@Injectable()
export class RedisMicroserviceService {}
