import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CronService } from './cron.service';
import { TasksModule } from '../tasks/tasks.module';

@Global()
@Module({
  imports: [ScheduleModule.forRoot(), TasksModule],
  providers: [CronService],
  controllers: [],
  exports: [CronService],
})
export class CronModule {}
