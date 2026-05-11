import { Module } from '@nestjs/common';

import { AppConfigModule } from '@app/config';
import { AppLoggerModule } from '@app/logger';

import { ClAppService } from './clApp.service';
import { UtilsModule } from '../../utils/utils.module';
import { ClModule } from './modules/cl.module';
import { MongoModule } from '../../utils/mongo/mongo.module';
import { CatsModule } from '../../cats/cats.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    AppLoggerModule.forRoot({ appName: 'cli' }),
    UtilsModule,
    ClModule,
    MongoModule,
    CatsModule,
  ],
  providers: [ClAppService],
})
export class ClAppModule {}
