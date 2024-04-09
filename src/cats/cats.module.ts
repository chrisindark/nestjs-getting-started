import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cats } from './cats.entity';
import { CatsSeederService } from './cats.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cats], 'testMongo')],
  controllers: [CatsController],
  providers: [CatsService, CatsSeederService],
  exports: [CatsService, CatsSeederService],
})
export class CatsModule {}
