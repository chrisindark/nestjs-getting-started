import { Logger, Type, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { INestMicroservice } from '@nestjs/common';
import type { MicroserviceOptions } from '@nestjs/microservices';

import { AllExceptionsFilter } from './all-exceptions.filter';

export interface MicroserviceBootstrapOptions {
  /** Logical name printed in the startup log line. */
  appName: string;
  /** Transport block to forward to `NestFactory.createMicroservice`. */
  transport: MicroserviceOptions;
  /** Disable the default global ValidationPipe. */
  enableValidation?: boolean;
}

/**
 * Boots a pure Nest microservice (no HTTP). Use for services whose only
 * job is to react to messages from a transport (Kafka, NATS, RabbitMQ,
 * etc.) and whose handlers are `@EventPattern` / `@MessagePattern`
 * controllers.
 */
export async function bootstrapMicroservice(
  module: Type<unknown>,
  options: MicroserviceBootstrapOptions,
): Promise<INestMicroservice> {
  const logger = new Logger('Bootstrap');
  logger.debug(`NODE_ENV - ${process.env.NODE_ENV ?? 'development'}`);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    module,
    {
      ...options.transport,
      bufferLogs: true,
    },
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  if (options.enableValidation !== false) {
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
  }
  app.enableShutdownHooks();

  await app.listen();
  logger.log(`${options.appName} microservice ready`);
  return app;
}
