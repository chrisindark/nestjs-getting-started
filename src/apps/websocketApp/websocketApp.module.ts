import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AppConfigModule } from '@app/config';

import { SentryModule } from 'src/interceptors/sentry/sentry.module';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { EventsModule } from './modules/events/events.module';
// import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    SentryModule,
    EventsModule,
    // MessageModule
  ],
})
export class WebsocketAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
