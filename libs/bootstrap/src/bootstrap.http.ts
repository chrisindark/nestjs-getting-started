import { Logger, Type, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import fastifyCookie from '@fastify/cookie';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AllExceptionsFilter } from './all-exceptions.filter';
import type { HttpBootstrapOptions } from './options.types';

/**
 * Boots a Fastify-backed Nest application with the project's shared
 * conventions (global validation, exception filter, CORS, versioning,
 * shutdown hooks). Returns the running application instance so callers
 * can attach extra hooks (microservices, swagger, etc.) before listening.
 */
export async function bootstrapHttpApp(
  module: Type<unknown>,
  options: HttpBootstrapOptions,
): Promise<NestFastifyApplication> {
  const logger = new Logger('Bootstrap');
  logger.debug(`NODE_ENV - ${process.env.NODE_ENV ?? 'development'}`);

  const adapter = new FastifyAdapter({ logger: false, trustProxy: true });
  const app = await NestFactory.create<NestFastifyApplication>(
    module,
    adapter,
    {
      bufferLogs: true,
      ...options.nestOptions,
    },
  );

  await app.register(fastifyCookie);

  const ExceptionFilterCtor = options.exceptionFilter ?? AllExceptionsFilter;
  app.useGlobalFilters(
    new ExceptionFilterCtor(),
    ...(options.globalFilters ?? []),
  );

  if (options.enableValidation !== false) {
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
      ...(options.globalPipes ?? []),
    );
  } else if (options.globalPipes?.length) {
    app.useGlobalPipes(...options.globalPipes);
  }

  if (options.enableVersioning !== false) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: options.defaultVersion ?? ['1'],
    });
  }

  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);

  const config = app.get(ConfigService);

  if (options.enableCors !== false) {
    app.enableCors({
      origin:
        config
          .get<string>('CORS_ORIGIN_WHITELIST')
          ?.split(',')
          .filter(Boolean) ?? [],
      methods:
        config.get<string>('CORS_ALLOW_METHODS')?.split(',').filter(Boolean) ??
        [],
      allowedHeaders:
        config.get<string>('CORS_ALLOW_HEADERS')?.split(',').filter(Boolean) ??
        [],
      exposedHeaders: [],
      credentials: true,
      maxAge: 0,
      preflightContinue: true,
      optionsSuccessStatus: 200,
    });
  }

  const port =
    options.port ?? (Number(config.get<number | string>('APP_PORT')) || 3000);
  const address =
    options.address ?? config.get<string>('APP_ADDRESS') ?? '0.0.0.0';

  await app.listen(port, address);
  logger.log(`${options.appName} listening on http://${address}:${port}`);
  return app;
}
