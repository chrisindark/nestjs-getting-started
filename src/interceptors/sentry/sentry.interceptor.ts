import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

import { SentryService } from "./sentry.service";

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SentryInterceptor.name);

  constructor(private readonly sentryService: SentryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // this.logger.log('started');
    const request = context.getArgByIndex(0);
    const { method, url, headers, body, params, query } = request;
    const transactionData = {
      name: `Route: ${method} ${url}`,
      op: "transaction",
    };
    const contextData = {
      method,
      url,
      headers,
      body,
      params,
      query,
    };

    const urlsToNotIntercept = [];

    const shouldIntercept = !urlsToNotIntercept.includes(request.url);

    if (shouldIntercept) {
      // recreate transaction based from HTTP request
      const transaction = this.sentryService.startTransaction(transactionData);
      // this.logger.log(transaction);
      this.sentryService.startSpan(transaction, contextData);
      const span = this.sentryService.startChild({ op: `route handler` });
    }
    return next.handle().pipe(
      catchError((err) => {
        // const exceptionContextdata = { tags: {}, extras: {} };
        // this.sentryService.captureException(err, exceptionContextdata);
        return throwError(err);
      }),
      finalize(() => {
        // this.logger.log('finished');
        if (shouldIntercept) {
          // span.finish();
          this.sentryService.finish();
        }
      }),
    );
  }
}
