import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppConfigModule } from '@app/config';
import { AppLoggerModule, CorrelationIdMiddleware } from '@app/logger';
import { PublisherModule } from '@app/publisher';
import { QueueName } from '@app/queue';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingModule } from '../../modules/ping/ping.module';
import { UtilsModule } from '../../utils/utils.module';
import { MongoModule } from '../../utils/mongo/mongo.module';
import { CatsModule } from '../../cats/cats.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    AppLoggerModule.forRoot({ appName: 'api' }),
    PublisherModule.forRoot({
      withKafka: true,
      withPubSub: true,
      queues: [QueueName.Reports],
      kafkaClientId: 'api',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'dist', 'client'),
    }),
    PingModule,
    UtilsModule,
    MongoModule,
    CatsModule,
  ],
  providers: [AppService],
  controllers: [AppController],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
