import type { ExceptionFilter, PipeTransform, Type } from '@nestjs/common';
import type { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import type { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';

export interface HttpBootstrapOptions {
  /** Logical name printed in the startup log line. */
  appName: string;
  /** Override the default port (defaults to `APP_PORT` env or 3000). */
  port?: number;
  /** Override the default bind address (defaults to `APP_ADDRESS` env or 0.0.0.0). */
  address?: string;
  /** Disable CORS entirely (defaults to enabled, driven by env). */
  enableCors?: boolean;
  /** Disable URI versioning entirely. */
  enableVersioning?: boolean;
  /** Default URI version when versioning is enabled. */
  defaultVersion?: string | string[];
  /** Disable the global `ValidationPipe`. */
  enableValidation?: boolean;
  /** Extra global filters to register after the default `AllExceptionsFilter`. */
  globalFilters?: ExceptionFilter[];
  /** Extra global pipes to register after the default `ValidationPipe`. */
  globalPipes?: PipeTransform[];
  /** Options forwarded to `NestFactory.create`. */
  nestOptions?: NestApplicationOptions;
  /** Replace the default `AllExceptionsFilter` with a custom filter type. */
  exceptionFilter?: Type<ExceptionFilter>;
}

export interface ContextBootstrapOptions {
  /** Logical name printed in the startup log line. */
  appName: string;
  /** Options forwarded to `NestFactory.createApplicationContext`. */
  nestOptions?: NestApplicationContextOptions;
  /** Run a one-shot job and exit (used by CLI / batch workers). */
  runOnce?: boolean;
}
