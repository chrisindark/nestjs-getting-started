import { LoggerService } from '@nestjs/common';
import { utilities as nestWinstonUtilities } from 'nest-winston';
import {
  Logger as WinstonLogger,
  createLogger,
  format,
  transports,
} from 'winston';

import { getCorrelationStore } from './correlation.service';

export interface WinstonFactoryOptions {
  appName: string;
  level?: string;
  /** Pretty (nest-like) console format. Defaults to NODE_ENV !== 'production'. */
  pretty?: boolean;
}

/**
 * Build a Winston instance + Nest `LoggerService` adapter for code that
 * prefers winston's transport ecosystem (file rotation, Cloudwatch,
 * etc.). Pino is still the primary platform logger — use this only for
 * specific subsystems (cron audit log, security log, etc.) where you
 * want a separate sink.
 *
 * Correlation id is attached automatically via a winston `format`.
 */
export function createWinstonLogger(
  options: WinstonFactoryOptions,
): WinstonLogger {
  const isProd = process.env.NODE_ENV === 'production';
  const pretty = options.pretty ?? !isProd;
  const level =
    options.level ?? process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug');

  const correlationFormat = format((info) => {
    const store = getCorrelationStore();
    if (store) {
      info.correlationId = store.correlationId;
      if (store.source) info.source = store.source;
    }
    info.app = options.appName;
    return info;
  })();

  const consoleFormat = pretty
    ? format.combine(
        correlationFormat,
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.ms(),
        nestWinstonUtilities.format.nestLike(options.appName, {
          colors: true,
          prettyPrint: true,
        }),
      )
    : format.combine(correlationFormat, format.timestamp(), format.json());

  return createLogger({
    level,
    exitOnError: false,
    transports: [
      new transports.Console({ format: consoleFormat, handleExceptions: true }),
    ],
  });
}

/**
 * Adapter that satisfies Nest's `LoggerService` interface. Pass to
 * `app.useLogger(...)` if you want winston to back Nest's default
 * `Logger` instead of pino.
 */
export class WinstonNestLoggerService implements LoggerService {
  constructor(private readonly winston: WinstonLogger) {}

  log(message: unknown, context?: string) {
    this.winston.info(this.format(message), { context });
  }
  error(message: unknown, trace?: string, context?: string) {
    this.winston.error(this.format(message), { context, trace });
  }
  warn(message: unknown, context?: string) {
    this.winston.warn(this.format(message), { context });
  }
  debug(message: unknown, context?: string) {
    this.winston.debug(this.format(message), { context });
  }
  verbose(message: unknown, context?: string) {
    this.winston.verbose(this.format(message), { context });
  }

  private format(message: unknown): string {
    return typeof message === 'string' ? message : JSON.stringify(message);
  }
}
