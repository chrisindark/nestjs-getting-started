import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { Span, SpanContext, Transaction } from '@sentry/types';

import {
  DEVELOPMENT_KEY,
  PRODUCTION_KEY,
  STAGING_KEY,
} from 'src/constants/constants';

@Injectable()
export class SentryService {
  private readonly logger = new Logger(SentryService.name);

  constructor(private readonly configService: ConfigService) {
    this._init();
  }

  _init() {
    const SENTRY_OPTIONS = {
      dsn: this.configService.get('SENTRY_DSN'),
      sampleRate:
        process.env.NODE_ENV === PRODUCTION_KEY
          ? Number(this.configService.get('SENTRY_SAMPLE_RATE')) || 0.1
          : 0.0,
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate:
        process.env.NODE_ENV === PRODUCTION_KEY
          ? Number(this.configService.get('SENTRY_TRACES_SAMPLE_RATE')) || 0.1
          : 0.0,
      debug:
        process.env.NODE_ENV === PRODUCTION_KEY
          ? false
          : process.env.NODE_ENV === STAGING_KEY
            ? false
            : true,
      environment: process.env.NODE_ENV
        ? `${process.env.NODE_ENV}`
        : DEVELOPMENT_KEY,
      enabled: true,
      attachStacktrace: true,
    };
    // initialization of Sentry, this is where Sentry will create a Hub
    Sentry.init(SENTRY_OPTIONS);
  }

  /**
   * Return the current span defined in the current Hub and Scope
   */
  getSpan(): Span {
    return Sentry.getCurrentHub().getScope().getSpan();
  }

  setSpan(spanData): void {
    const { transaction, contextData } = spanData;
    // setup context of newly created transaction
    Sentry.getCurrentHub().configureScope((scope) => {
      scope.setSpan(transaction);
      // customize your context here
      scope.setContext('http', contextData);
    });
  }

  getScope() {
    return Sentry.getCurrentHub().getScope();
  }

  /**
   * When injecting the service it will create the main transaction
   */
  startTransaction(transactionData): Transaction {
    // this.logger.log("startTransaction");
    const transaction = Sentry.startTransaction(transactionData);
    return transaction;
  }

  startSpan(transaction, contextData) {
    const spanData = { transaction, contextData };
    this.setSpan(spanData);
  }

  finish() {
    // this.logger.log("finish");
    this.getSpan().finish();
  }

  captureException(err, context?: any) {
    // this.logger.log("captureException");
    // this.logger.log(context);
    const scope = this.getScope();
    scope.setTags(context?.tags);
    scope.setExtras(context?.extras);
    const response = Sentry.captureException(err, scope);
    return response;
  }

  /**
   * This will simply start a new child span in the current span
   *
   * @param spanContext
   */
  startChild(spanContext: SpanContext) {
    const span = this.getSpan();
    return span && span.startChild(spanContext);
  }

  catchWithSentry(
    err,
    contextData?: Record<string, unknown>,
    exceptionContextdata?: {
      tags: Record<string, unknown>;
      extras: Record<string, unknown>;
    },
  ) {
    const transactionData = {
      name: `CatchWithSentry`,
      op: 'exception',
    };
    const transaction = this.startTransaction(transactionData);
    this.startSpan(transaction, contextData);
    const span = this.startChild({
      op: `catchWithSentry handler`,
    });
    this.captureException(err, exceptionContextdata);
    span.finish();
    this.finish();
  }
}
