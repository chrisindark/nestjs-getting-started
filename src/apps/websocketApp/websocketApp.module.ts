import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import configuration from "../../config/configuration";

import { PRODUCTION_KEY, STAGING_KEY } from "src/constants/constants";
import { SentryModule } from "src/interceptors/sentry/sentry.module";
import { LoggerMiddleware } from "src/middlewares/logger.middleware";
import { EventsModule } from "./modules/events/events.module";
// import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath:
        process.env.NODE_ENV === PRODUCTION_KEY
          ? ".env.production"
          : process.env.NODE_ENV === STAGING_KEY
          ? ".env.staging"
          : ".env.local",
      load: [configuration],
    }),
    SentryModule,
    EventsModule,
    // MessageModule
  ],
})
export class WebsocketAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
