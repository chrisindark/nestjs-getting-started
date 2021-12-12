import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from "@nestjs/microservices";

import { KafkaConsumerController } from "./kafka-consumer.controller";
import { KafkaConsumerService } from "./kafka-consumer.service";

@Module({
  imports: [ConfigModule],
  controllers: [KafkaConsumerController],
  providers: [
    {
      provide: "KAFKA_CONSUMER_SERVICE",
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: "internal-tools-kafka",
              brokers: configService.get("kafka.brokers").split(","),
            },
            consumer: {
              groupId: "internal-tools-kafka",
              readUncommitted: true,
              allowAutoTopicCreation: true,
            },
            subscribe: {
              fromBeginning: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    KafkaConsumerService,
  ],
})
export class KafkaConsumerModule {}
