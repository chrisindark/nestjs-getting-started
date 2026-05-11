import { INestApplicationContext, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger } from 'nestjs-pino';

import type { ContextBootstrapOptions } from './options.types';

/**
 * Boots a Nest application without an HTTP server. Use for cron workers,
 * pub/sub subscribers, kafka consumers, and CLI commands. Honours SIGINT /
 * SIGTERM and, when `runOnce: true`, closes the context and exits as soon
 * as `NestFactory.createApplicationContext` resolves (useful for one-shot
 * scripts triggered by an external scheduler).
 */
export async function bootstrapContextApp(
  module: Type<unknown>,
  options: ContextBootstrapOptions,
): Promise<INestApplicationContext> {
  const app = await NestFactory.createApplicationContext(module, {
    bufferLogs: true,
    ...options.nestOptions,
  });

  app.useLogger(app.get(PinoLogger));
  const logger = app.get(PinoLogger);
  logger.debug(`NODE_ENV - ${process.env.NODE_ENV ?? 'development'}`);

  app.enableShutdownHooks();

  if (options.runOnce) {
    logger.log(`${options.appName} ran one-shot job, exiting`);
    await app.close();
    process.exit(0);
  }

  const shutdown = async (signal: NodeJS.Signals) => {
    logger.log(`Received ${signal}, shutting down ${options.appName}`);
    await app.close();
    process.exit(0);
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);

  logger.log(`${options.appName} ready`);
  return app;
}
