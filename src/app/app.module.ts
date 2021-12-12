import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import configuration from "../config/configuration";

import { KafkaMicroserviceModule } from "src/kafka-microservice/kafka-microservice.module";
import { KafkaConsumerModule } from "src/kafka-consumer/kafka-consumer.module";
import { RedisMicroserviceModule } from "src/redis-microservice/redis-microservice.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === "production"
          ? ".production.env"
          : process.env.NODE_ENV === "staging"
          ? ".staging.env"
          : ".development.env",
      load: [configuration],
    }),
    KafkaMicroserviceModule,
    KafkaConsumerModule,
    RedisMicroserviceModule,
  ],
  exports: [],
})
export class AppModule {}
