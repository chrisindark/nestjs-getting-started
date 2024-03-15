import { Global, Module } from '@nestjs/common';

import { EncryptionService } from 'src/utils/encryption/encryption.service';

@Global()
@Module({
  imports: [],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
