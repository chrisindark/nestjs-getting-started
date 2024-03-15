import { Module } from '@nestjs/common';

import { PingService } from 'src/modules/ping/ping.service';
import { PingController } from 'src/modules/ping/ping.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PingService],
  controllers: [PingController],
  exports: [PingService],
})
export class PingModule {}
