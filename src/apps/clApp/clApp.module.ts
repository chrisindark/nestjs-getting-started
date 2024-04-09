import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../../config/configuration';

import { PRODUCTION_KEY, STAGING_KEY } from '../../constants/constants';
import { ClAppService } from './clApp.service';
import { UtilsModule } from '../../utils/utils.module';
import { ClModule } from './modules/cl.module';
import { MongoModule } from '../../utils/mongo/mongo.module';
import { CatsModule } from '../../cats/cats.module';

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
    UtilsModule,
    ClModule,
    MongoModule,
    CatsModule,
  ],
  providers: [ClAppService],
})
export class ClAppModule {}
