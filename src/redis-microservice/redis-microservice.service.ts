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
  ClientRedis,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import {} from '@nestjs/microservices/external/redis.interface';
import Utils from 'src/utils';

@Injectable()
export class RedisMicroserviceService {}
