import { Module } from '@nestjs/common';

import { TwilioService } from 'src/utils/twilio/twilio.service';

@Module({
  imports: [],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
