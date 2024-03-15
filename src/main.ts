// import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import fastifyCookie from '@fastify/cookie';
import {
  // FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
// import multipart from '@fastify/multipart';
// import { WsAdapter } from '@nestjs/platform-ws';

import { AppModule } from './modules/app/app.module';
import { AllExceptionsFilter } from './exceptions/all-exceptions-filter';
// import { PRODUCTION_KEY, STAGING_KEY } from './constants/constants';

async function bootstrap() {
  try {
    // const fastifyAdapter = new FastifyAdapter({
    //   logger:
    //     process.env.NODE_ENV === PRODUCTION_KEY
    //       ? false
    //       : process.env.NODE_ENV === STAGING_KEY
    //       ? false
    //       : false,
    // });
    // fileSize limit = 1GB
    // fastifyAdapter.register(require("fastify-multipart"), {
    //   fileSize: 1024 * 1024 * 1024,
    // });

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      // fastifyAdapter,
    );
    // app.register(fastifyCookie, {});
    // app.register(multipart, {});

    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      // origin:
      //   app.get(ConfigService).get("CORS_ORIGIN_WHITELIST").split(",") || [],
      // methods:
      //   app.get(ConfigService).get("CORS_ALLOW_METHODS").split(",") || [],
      // allowedHeaders:
      //   app.get(ConfigService).get('CORS_ALLOW_HEADERS').split(',') || [],
      // exposedHeaders: [],
      // credentials: true,
      // maxAge: 0,
      // preflightContinue: true,
      // optionsSuccessStatus: 200,
    });
    // app.enableVersioning({
    //   type: VersioningType.URI,
    //   defaultVersion: ['1'],
    // });
    app.enableShutdownHooks(['SIGINT', 'SIGTERM']);

    // app.useWebSocketAdapter(new WsAdapter(app));

    const serverPort = app.get(ConfigService).get('APP_PORT') || 3000;
    const serverAddress =
      app.get(ConfigService).get('APP_ADDRESS') || '0.0.0.0';
    Logger.log(serverPort, 'Listening on port');
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
    await app.listen(serverPort, serverAddress);
  } catch (e) {
    Logger.log(e);
  }
}

bootstrap();
