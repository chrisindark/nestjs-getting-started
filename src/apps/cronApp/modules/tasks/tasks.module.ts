import { Module } from '@nestjs/common';

import { TasksService } from './tasks.service';

@Module({
  imports: [],
  providers: [TasksService],
  controllers: [],
  exports: [TasksService],
})
export class TasksModule {}
