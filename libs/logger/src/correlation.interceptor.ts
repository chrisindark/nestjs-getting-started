import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { KafkaContext } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';

import { correlationFromKafkaHeaders } from './correlation.utils';
import { CorrelationService } from './correlation.service';

/**
 * Global interceptor that extracts an incoming correlation id from the
 * transport-specific slot and binds it to the current async resource
 * for the rest of the handler.
 *
 * Wire it via `APP_INTERCEPTOR` in any app where you want automatic
 * propagation. Today this is the kafka consumer (RPC context). HTTP
 * uses `CorrelationIdMiddleware` instead because middleware can wrap a
 * callback and gives a more predictable lifecycle for response headers.
 */
@Injectable()
export class CorrelationInterceptor implements NestInterceptor {
  constructor(private readonly correlation: CorrelationService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const { id, source } = this.extract(context);
    this.correlation.enterWith({
      correlationId: id ?? randomUUID(),
      source,
    });
    return next.handle();
  }

  private extract(context: ExecutionContext): {
    id: string | undefined;
    source: string | undefined;
  } {
    const type = context.getType();
    if (type === 'rpc') {
      const rpc = context.switchToRpc();
      const rpcCtx = rpc.getContext() as Partial<KafkaContext> | undefined;
      if (rpcCtx && typeof rpcCtx.getMessage === 'function') {
        const message = rpcCtx.getMessage();
        const topic =
          typeof rpcCtx.getTopic === 'function' ? rpcCtx.getTopic() : undefined;
        return {
          id: correlationFromKafkaHeaders(
            message?.headers as Record<string, unknown> | undefined,
          ),
          source: topic ? `kafka:${topic}` : 'kafka',
        };
      }
      return { id: undefined, source: 'rpc' };
    }
    return { id: undefined, source: type };
  }
}
