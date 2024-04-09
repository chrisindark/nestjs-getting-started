import { Injectable, Logger } from '@nestjs/common';

import { CatsSeederService } from '../../../cats/cats.seeder.service';

@Injectable()
export class ClService {
  private readonly logger = new Logger(ClService.name);

  constructor(private readonly catsSeederService: CatsSeederService) {
    this.initCatsSeeder();
  }

  async test() {
    this.logger.log('test');
  }

  initCatsSeeder = async () => {
    this.logger.log('initCatsSeeder');
    await this.catsSeederService.create();
  };
}
