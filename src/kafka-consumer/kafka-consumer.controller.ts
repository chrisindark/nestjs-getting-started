import { Controller, Get, Inject, Logger, OnModuleInit } from "@nestjs/common";
import {
  Client,
  ClientKafka,
  ClientProxy,
  ClientProxyFactory,
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
  Transport,
} from "@nestjs/microservices";
import {
  Consumer,
  Producer,
} from "@nestjs/microservices/external/kafka.interface";
import { Subscription, timeout } from "rxjs";
import Utils from "src/utils";

import { KafkaConsumerService } from "./kafka-consumer.service";

@Controller("api/v1/kafkaConsumer")
export class KafkaConsumerController implements OnModuleInit {
  constructor(
    // @Inject("KAFKA_CONSUMER_SERVICE")
    // private clientKafka: ClientKafka,
    private kafkaConsumerService: KafkaConsumerService,
  ) {}

  async onModuleInit() {
    try {
      // this.clientKafka.subscribeToResponseOf("thirdTopic");
      // const res: Producer = await this.clientKafka.connect();
      // console.log(res);
    } catch (e) {
      console.error(e);
      // send the error to apm or sentry or both
    }
  }

  // @EventPattern("thirdTopic")
  // async handleThirdEntityCreated(data: any) {
  //   console.log(JSON.stringify(data) + " created");
  // }

  // @MessagePattern("thirdTopic")
  // async addPost(@Payload() messages, @Ctx() context: KafkaContext) {
  //   try {
  //     console.log("here", messages);
  //     /*
  //     Here we would be having some series of operations
  //     */
  //     // console.log(this.kafkaService.consumeOffset(1212,1212))
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);

  //     // tries to consume the msg again
  //     // this.kafkaService.consumeOffset(messages.offset, messages.partition);
  //   }
  // }

  // @Get("/publish")
  // async publish(): Promise<any> {
  //   const res = await this.publishMessage("thirdTopic", {
  //     value: '{"hello":"world"}',
  //   });
  //   return res;
  // }

  async publishMessage(topic, message) {
    try {
      // const res = this.clientKafka.emit(topic, message).pipe(timeout(5000));
      // console.log(res);
      // return res;
    } catch (e) {
      Logger.error(e, "", "KAFKACONSUMER");
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
