import { Global, Module } from '@nestjs/common';

import { RedisService } from 'src/utils/redis/redis.service';

@Global()
@Module({
  imports: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
