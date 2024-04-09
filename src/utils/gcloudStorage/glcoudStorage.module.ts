import { Global, Module } from '@nestjs/common';

import { GCloudStorageService } from './gcloudStorage.service';

@Global()
@Module({
  imports: [],
  providers: [GCloudStorageService],
  exports: [GCloudStorageService],
})
export class GCloudStorageModule {}
