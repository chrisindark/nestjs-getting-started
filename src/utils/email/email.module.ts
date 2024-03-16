import { Global, Module } from '@nestjs/common';

import { EmailService } from './email.service';
import { GCloudPubSubModule } from 'src/utils/gcloudPubSub/gcloudPubSub.module';

@Global()
@Module({
  imports: [GCloudPubSubModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
