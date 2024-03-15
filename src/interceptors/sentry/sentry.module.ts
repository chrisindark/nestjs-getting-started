import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { SentryInterceptor } from './sentry.interceptor';
import { SentryService } from './sentry.service';

@Global()
@Module({
  imports: [],
  providers: [
    SentryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
  exports: [SentryService],
})
export class SentryModule {}
