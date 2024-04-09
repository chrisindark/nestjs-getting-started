import { Module } from '@nestjs/common';

import { PingService } from './ping.service';
import { PingController } from './ping.controller';
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [],
  providers: [PingService],
  controllers: [PingController],
  exports: [PingService],
})
export class PingModule {}
