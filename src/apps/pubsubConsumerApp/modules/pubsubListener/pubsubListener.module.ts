import { Module } from '@nestjs/common';

import { PubSubModule } from '@app/messaging';

import { PubSubListenerService } from './pubsubListener.service';

@Module({
  imports: [PubSubModule],
  providers: [PubSubListenerService],
})
export class PubSubListenerModule {}
