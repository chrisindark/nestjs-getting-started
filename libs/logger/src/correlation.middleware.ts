import { Injectable, NestMiddleware } from '@nestjs/common';

import { CORRELATION_ID_HEADER } from './correlation.constants';
import { CorrelationService } from './correlation.service';

/** Minimal request/response surface we need; works for Express + Fastify alike. */
interface HasHeaders {
  headers?: Record<string, string | string[] | undefined>;
}
interface CanSetHeader {
  setHeader?: (name: string, value: string) => unknown;
  header?: (name: string, value: string) => unknown;
}

/**
 * HTTP middleware that wires the request into a correlation context.
 * Reads `x-correlation-id` from the inbound request (so callers can
 * propagate ids across services); falls back to a fresh uuid. The id is
 * always echoed back on the response so the caller sees what we
 * actually used.
 *
 * Apply globally in HTTP apps via `NestModule.configure`.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly correlation: CorrelationService) {}

  use(req: HasHeaders, res: CanSetHeader, next: () => void) {
    const incoming = req.headers?.[CORRELATION_ID_HEADER];
    const headerValue = Array.isArray(incoming) ? incoming[0] : incoming;

    this.correlation.runWithIncoming(headerValue, 'http', (id) => {
      if (typeof res.setHeader === 'function') {
        res.setHeader(CORRELATION_ID_HEADER, id);
      } else if (typeof res.header === 'function') {
        res.header(CORRELATION_ID_HEADER, id);
      }
      next();
    });
  }
}
