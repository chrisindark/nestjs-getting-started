import { Module } from '@nestjs/common';

import { GCloudTaskService } from './gcloudTask.service';

@Module({
  imports: [],
  providers: [GCloudTaskService],
  exports: [GCloudTaskService],
})
export class GCloudTaskModule {}
