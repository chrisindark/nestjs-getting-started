import { Controller, Get, Inject, Logger } from '@nestjs/common';
import {
  ClientRedis,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Controller('api/v1/redisMicroservice')
export class RedisMicroserviceController {
  constructor(
    @Inject('REDIS_SERVICE')
    private clientRedis: ClientRedis,
  ) {}

  // @MessagePattern({ cmd: "sum" })
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }

  @EventPattern('firstRedisTopic')
  async handleUserCreated(data: Record<string, unknown>) {
    // business logic
    console.log(JSON.stringify(data) + ' created in redis');
  }

  @Get('/publish')
  async publish(): Promise<any> {
    const res = await this.publishMessage('firstRedisTopic', {
      value: '{"hello":"world"}',
    });
    return res;
  }

  // any eventpattern decorator that matches this pattern gets triggered
  async publishMessage(pattern, payload) {
    try {
      const res = this.clientRedis.emit(pattern, payload).pipe(timeout(5000));
      // console.log(res);
      return res;
    } catch (e) {
      Logger.error(e, '', 'REDISMICROSERVICE');
      // let options = {
      //   custom: {
      //     event: "ERROR",
      //     error: e,
      //   },
      // };
      // Utils.catchWithApm(e, options);
    }
  }
}
