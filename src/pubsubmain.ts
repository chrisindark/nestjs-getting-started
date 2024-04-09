import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
// import fastifyCookie from '@fastify/cookie';
import { WinstonModule } from 'nest-winston';

import { SubscriberAppModule } from './apps/subscriberApp/subscriberApp.module';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import winstonLogger from './utils/winston/logger';

async function bootstrap() {
  Logger.debug(`NODE_ENV - ${process.env.NODE_ENV}`);

  try {
    const fastifyAdapter = new FastifyAdapter({
      logger: false,
    });

    const app = await NestFactory.create<NestFastifyApplication>(
      SubscriberAppModule,
      fastifyAdapter,
      {
        logger: WinstonModule.createLogger(winstonLogger),
      },
    );
    // app.register(fastifyCookie, {});
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors({
      origin:
        app.get(ConfigService).get('CORS_ORIGIN_WHITELIST').split(',') || [],
      methods:
        app.get(ConfigService).get('CORS_ALLOW_METHODS').split(',') || [],
      credentials: true,
    });
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: ['1'],
    });
    const serverPort = app.get(ConfigService).get('APP_PORT') || 3000;
    const serverAddress =
      app.get(ConfigService).get('APP_ADDRESS') || '0.0.0.0';
    await app.listen(serverPort, serverAddress);
  } catch (e) {
    Logger.error(e);
  }
}
bootstrap();
