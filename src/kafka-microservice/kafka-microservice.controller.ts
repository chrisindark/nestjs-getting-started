import {
  Controller,
  Get,
  Inject,
  Logger,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  Client,
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import {
  Consumer,
  Producer,
} from '@nestjs/microservices/external/kafka.interface';
import { Observable, Subscription, timeout } from 'rxjs';
import Utils from 'src/utils';

import { KafkaMicroserviceService } from './kafka-microservice.service';

@Controller('api/v1/kafkaMicroservice')
export class KafkaMicroserviceController
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor(
    // @Inject("KAFKA_SERVICE")
    // private clientKafka: ClientKafka,
    private readonly kafkaMicroserviceService: KafkaMicroserviceService,
  ) {}

  async onModuleInit() {
    try {
      // this.clientKafka.subscribeToResponseOf("firstTopic");
      // this.clientKafka.subscribeToResponseOf("secondTopic");
      // const res: Producer = await this.clientKafka.connect();
      // console.log(res);
    } catch (e) {
      console.error(e);
      // send the error to apm or sentry or both
    }
  }

  async onModuleDestroy() {
    // const res = await this.clientKafka.close();
    // console.log(res);
  }

  async onApplicationShutdown(signal?: string) {
    // console.log(signal);
  }

  @EventPattern('firstTopic')
  async handleFirstEntityCreated(data: any) {
    console.log(JSON.stringify(data) + ' created in kafka');
    // const res = this.clientKafka
    //   .emit("secondTopic", data.value)
    //   .pipe(timeout(5000));
  }

  // @EventPattern("secondTopic")
  // async handleSecondEntityCreated(data: any) {
  //   console.log(JSON.stringify(data) + " created");
  // }

  // @MessagePattern("firstTopic")
  // async addPost(@Payload() messages, @Ctx() context: KafkaContext) {
  //   try {
  //     console.log("here", messages);
  //     /*
  //     Here we would be having some series of operations
  //     */
  //     // console.log(this.kafkaService.consumeOffset(1212,1212))
  //   } catch (error) {
  //     console.log(error);

  //     // tries to consume the msg again
  //     // this.kafkaService.consumeOffset(messages.offset, messages.partition);
  //   }
  // }

  // @MessagePattern("secondTopic")
  // async addArticle(@Payload() messages, @Ctx() context: KafkaContext) {
  //   try {
  //     console.log("here", messages);
  //     /*
  //     Here we would be having some series of operations
  //     */
  //     // console.log(this.kafkaService.consumeOffset(1212,1212))
  //   } catch (error) {
  //     console.log(error);

  //     // tries to consume the msg again
  //     // this.kafkaService.consumeOffset(messages.offset, messages.partition);
  //   }
  // }

  @Get('/publish')
  async publish(): Promise<any> {
    const res = await this.publishMessage('firstTopic', {
      value: '{"hello":"world"}',
    });
    return res;
  }

  async publishMessage(topic, message) {
    try {
      // const res = this.clientKafka.emit(topic, message).pipe(timeout(5000));
      // console.log(res);
      // return res;
    } catch (e) {
      Logger.error(e, '', 'KAFKAMICROSERVICE');
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
