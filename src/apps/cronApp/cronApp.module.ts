import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../../config/configuration';

import { LoggerMiddleware } from '../../middlewares/logger.middleware';

// import { SentryModule } from '../../interceptors/sentry/sentry.module';
import { MysqlModule } from 'src/utils/mysql/mysql.module';
import { PingModule } from '../../modules/ping/ping.module';
import { PRODUCTION_KEY, STAGING_KEY } from 'src/constants/constants';
import { UtilsModule } from 'src/utils/utils.module';
import { CronModule } from './modules/cron/cron.module';
import { BullQueueModule } from 'src/utils/bull/bullQueue.module';
import { BullQueueConsumerModule } from 'src/utils/bull/bullQueueConsumer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath:
        process.env.NODE_ENV === PRODUCTION_KEY
          ? '.env.production'
          : process.env.NODE_ENV === STAGING_KEY
            ? '.env.staging'
            : '.env.local',
      load: [configuration],
    }),
    // SentryModule,
    MysqlModule,
    PingModule,
    UtilsModule,
    CronModule,
    BullQueueModule,
    BullQueueConsumerModule,
  ],
})
export class CronAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
