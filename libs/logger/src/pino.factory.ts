import type { Params } from 'nestjs-pino';
import { randomUUID } from 'crypto';

import { CORRELATION_ID_HEADER } from './correlation.constants';
import { getCorrelationStore } from './correlation.service';

export interface PinoFactoryOptions {
  /** App name attached to every log entry under `app`. */
  appName: string;
  /**
   * Pino log level. Defaults to LOG_LEVEL env var, else 'debug' in
   * development, 'info' otherwise.
   */
  level?: string;
  /** Pretty-print logs (dev-only). Defaults to NODE_ENV !== 'production'. */
  pretty?: boolean;
}

/**
 * Build a `Params` object for `LoggerModule.forRoot(...)` (nestjs-pino).
 *
 * Why a factory rather than inline config? Every app shares the same
 * three behaviours we care about:
 *
 *   1. `mixin` reads from AsyncLocalStorage so every log line gets the
 *      current correlation id automatically — no logger.log({correlationId, ...}).
 *   2. `genReqId` for HTTP requests reads the inbound header and falls
 *      back to a fresh uuid (and the HTTP middleware echoes it on the
 *      response).
 *   3. `transport: pino-pretty` in dev, plain JSON in prod.
 *
 * Keeping this in one place means a per-app "patch" can't drift.
 */
export function createPinoOptions(options: PinoFactoryOptions): Params {
  const isProd = process.env.NODE_ENV === 'production';
  const pretty = options.pretty ?? !isProd;
  const level =
    options.level ?? process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug');

  return {
    pinoHttp: {
      level,
      base: { app: options.appName },
      mixin() {
        const store = getCorrelationStore();
        if (!store) return {};
        return {
          correlationId: store.correlationId,
          ...(store.source ? { source: store.source } : {}),
        };
      },
      genReqId: (req, res) => {
        const headerVal = req.headers?.[CORRELATION_ID_HEADER];
        const incoming = Array.isArray(headerVal) ? headerVal[0] : headerVal;
        const id =
          (typeof incoming === 'string' && incoming.trim()) || randomUUID();
        if (typeof (res as { setHeader?: unknown }).setHeader === 'function') {
          (res as { setHeader: (n: string, v: string) => void }).setHeader(
            CORRELATION_ID_HEADER,
            id,
          );
        }
        return id;
      },
      customProps: () => {
        const store = getCorrelationStore();
        return store ? { correlationId: store.correlationId } : {};
      },
      serializers: {
        req: (req: { id?: string; method?: string; url?: string }) => ({
          id: req.id,
          method: req.method,
          url: req.url,
        }),
        res: (res: { statusCode?: number }) => ({
          statusCode: res.statusCode,
        }),
      },
      ...(pretty
        ? {
            transport: {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
                translateTime: 'SYS:HH:MM:ss.l',
                ignore: 'pid,hostname',
                messageFormat: '[{correlationId}] {msg}',
              },
            },
          }
        : {}),
    },
  };
}
