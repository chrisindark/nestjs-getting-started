import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

import { CorrelationContext } from './correlation.context';

/**
 * Module-singleton ALS instance. Kept outside the class so the pino
 * `mixin` callback (called per-log, without DI) can read the current
 * context without going through Nest.
 */
const correlationStorage = new AsyncLocalStorage<CorrelationContext>();

/** Read the current correlation context. Returns `undefined` outside a unit of work. */
export function getCorrelationStore(): CorrelationContext | undefined {
  return correlationStorage.getStore();
}

/**
 * Thin, injectable facade over the ALS singleton. Apps interact with
 * this rather than touching `AsyncLocalStorage` directly so we can swap
 * implementations later without rippling changes.
 */
@Injectable()
export class CorrelationService {
  /**
   * Run `fn` inside a fresh correlation context. Async work spawned by
   * `fn` inherits the context via `async_hooks`.
   */
  run<T>(context: CorrelationContext, fn: () => T): T {
    return correlationStorage.run(context, fn);
  }

  /**
   * Convenience: run `fn` with a brand new uuid when nothing was handed
   * in by an upstream system.
   */
  runWithNew<T>(source: string | undefined, fn: () => T): T {
    return this.run({ correlationId: randomUUID(), source }, fn);
  }

  /**
   * Run with an incoming id when present, else generate one. Always
   * returns the id that ended up in the context so callers can echo it
   * back (e.g. set as an HTTP response header).
   */
  runWithIncoming<T>(
    incoming: string | null | undefined,
    source: string | undefined,
    fn: (id: string) => T,
  ): T {
    const correlationId = incoming?.trim() || randomUUID();
    return this.run({ correlationId, source }, () => fn(correlationId));
  }

  /**
   * Bind the current async resource to a context without a callback.
   * Useful inside Nest interceptors and middlewares that must return
   * the downstream observable / call next() rather than wrapping a
   * callback.
   */
  enterWith(context: CorrelationContext): void {
    correlationStorage.enterWith(context);
  }

  getStore(): CorrelationContext | undefined {
    return correlationStorage.getStore();
  }

  getCorrelationId(): string | undefined {
    return correlationStorage.getStore()?.correlationId;
  }
}
