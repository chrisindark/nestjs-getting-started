import { Global, Module } from '@nestjs/common';

import { NodeArchiverService } from './nodeArchiver.service';

@Global()
@Module({
  imports: [],
  providers: [NodeArchiverService],
  exports: [NodeArchiverService],
})
export class NodeArchiverModule {}
