import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaMicroserviceController } from './kafka-microservice.controller';
import { KafkaMicroserviceService } from './kafka-microservice.service';

// This module acts as a kafka producer
@Module({
  imports: [
    ConfigModule,
    // ClientsModule.registerAsync([
    //   {
    //     imports: [ConfigModule],
    //     name: "KAFKA_SERVICE",
    //     useFactory: (configService: ConfigService) => {
    //       console.info(
    //         "Using kafka client - ",
    //         configService.get("kafka.brokers"),
    //       );

    //       return {
    //         name: "KAFKA_SERVICE",
    //         transport: Transport.KAFKA,
    //         options: {
    //           client: {
    //             clientId: "internal-tools-kafka",
    //             brokers: configService.get("kafka.brokers").split(","),
    //           },
    //           consumer: {
    //             groupId: "internal-tools-kafka",
    //             readUncommitted: true,
    //             allowAutoTopicCreation: true,
    //           },
    //           subscribe: {
    //             fromBeginning: true,
    //           },
    //         },
    //       };
    //     },
    //     inject: [ConfigService],
    //   },
    // ]),
  ],
  controllers: [KafkaMicroserviceController],
  providers: [KafkaMicroserviceService],
  exports: [],
})
export class KafkaMicroserviceModule {}
