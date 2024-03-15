import { Module, Global } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { QueueModule } from 'src/queue/queue.module';

@Global()
@Module({
  imports: [ScheduleModule.forRoot(), QueueModule],
  providers: [CronService],
  exports: [CronService],
  controllers: [CronController],
})
export class CronModule {}
