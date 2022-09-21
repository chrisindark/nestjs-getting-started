// import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app/app.module";
// import { AllExceptionsFilter } from "./exceptions/all-exceptions-filter";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

async function bootstrap() {
  try {
    const fastifyAdapter = new FastifyAdapter();
    // fileSize limit = 1GB
    fastifyAdapter.register(require("fastify-multipart"), {
      fileSize: 1024 * 1024 * 1024,
    });

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      fastifyAdapter,
    );
    // app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe());
    app.enableShutdownHooks(["SIGINT", "SIGTERM"]);
    app.enableCors();
    const port = app.get(ConfigService).get("server.port");
    Logger.log(port, "Listening on port");
    // const brokers = app.get(ConfigService).get("kafka.brokers").split(",");

    // This object acts as a kafka consumer
    // const kafkaMicroservice =
    //   await app.connectMicroservice<MicroserviceOptions>({
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: "nestjs-kafka",
    //         brokers: brokers,
    //       },
    //       consumer: {
    //         groupId: "nestjs-kafka",
    //         readUncommitted: true,
    //         allowAutoTopicCreation: true,
    //       },
    //       subscribe: {
    //         fromBeginning: true,
    //       },
    //     },
    //   });

    // const redisMicroservice = await app.connectMicroservice({
    //   transport: Transport.REDIS,
    //   options: {
    //     url: "redis://localhost:6379",
    //     retryAttempts: 0,
    //     retryDelay: 0,
    //   },
    // });

    // await app.startAllMicroservices();
    await app.listen(port);
  } catch (e) {
    Logger.log(e);
  }
}

bootstrap();
