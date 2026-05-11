import { Global, Module } from '@nestjs/common';

import { PubSubModule } from '@app/messaging';

import { EmailService } from './email.service';

@Global()
@Module({
  imports: [PubSubModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
