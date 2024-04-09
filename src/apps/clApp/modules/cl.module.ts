import { Module } from '@nestjs/common';

import { CatsModule } from '../../../cats/cats.module';
import { ClService } from './cl.service';

@Module({
  imports: [CatsModule],
  providers: [ClService],
  exports: [ClService],
})
export class ClModule {}
