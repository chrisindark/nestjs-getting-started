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
import { GCloudPubSubModule } from 'src/utils/gcloudPubSub/gcloudPubSub.module';
import { GCloudPubSubRegistryModule } from './modules/gcloudPubsubRegistry/gcloudPubsubRegistry.module';
import { SendgridModule } from '../../utils/sendgrid/sendgrid.module';
import { UtilsModule } from 'src/utils/utils.module';
import { EncryptionModule } from 'src/utils/encryption/encryption.module';
import { GCloudStorageModule } from 'src/utils/gcloudStorage/glcoudStorage.module';
import { EmailModule } from 'src/utils/email/email.module';
import { AwsS3Module } from 'src/utils/awsS3/awsS3.module';
import { NodeArchiverModule } from 'src/utils/nodeArchiver/nodeArchiver.module';
import { BullQueueModule } from 'src/utils/bull/bullQueue.module';
import { BullQueueConsumerModule } from 'src/utils/bull/bullQueueConsumer.module';
import { BullQueueConsumerRegistryModule } from './modules/bullQueueConsumerRegistry/bullQueueConsumerRegistry.module';

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
    AwsS3Module,
    GCloudPubSubModule,
    GCloudPubSubRegistryModule,
    SendgridModule,
    EncryptionModule,
    GCloudStorageModule,
    EmailModule,
    NodeArchiverModule,
    BullQueueModule,
    BullQueueConsumerModule,
    BullQueueConsumerRegistryModule,
  ],
})
export class SubscriberAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
