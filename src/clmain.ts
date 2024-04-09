import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { ClAppModule } from './apps/clApp/clApp.module';
// import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
// import { PRODUCTION_KEY, STAGING_KEY } from './constants/constants';

async function bootstrap() {
  Logger.debug(`NODE_ENV - ${process.env.NODE_ENV}`);

  try {
    const app = await NestFactory.create<NestFastifyApplication>(ClAppModule);

    app.enableShutdownHooks(['SIGINT', 'SIGTERM']);

    await app.close();
    process.exit(0);
    // process.exitCode = 0;
  } catch (e) {
    Logger.log(e);
  }
}

bootstrap();
