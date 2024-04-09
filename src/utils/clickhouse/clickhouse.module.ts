import { Global, Module } from '@nestjs/common';

import { ClickhouseService } from './clickhouse.service';

@Global()
@Module({
  imports: [],
  providers: [ClickhouseService],
  exports: [ClickhouseService],
})
export class ClickhouseModule {}
