import { Injectable, Logger } from '@nestjs/common';

import { CatsService } from './cats.service';
import { UtilsService } from '../utils/utils.service';
import { Cat } from './interfaces/cat.interface';

export const CATS_CREATE_LIMIT = 1000000;
export const BATCH_SIZE = 10000;

@Injectable()
export class CatsSeederService {
  private readonly logger = new Logger(CatsSeederService.name);

  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Cats>} catsRepository
   */
  constructor(
    private readonly catsService: CatsService,
    private readonly utilsService: UtilsService,
  ) {}

  generateRandomCat = (): Cat => {
    const names = [
      'Whiskers',
      'Smokey',
      'Mittens',
      'Luna',
      'Tiger',
      'Simba',
      'Oreo',
      'Bella',
      'Max',
      'Charlie',
    ];
    const breeds = [
      'Siamese',
      'Persian',
      'Maine Coon',
      'Ragdoll',
      'Bengal',
      'Sphynx',
      'British Shorthair',
      'Scottish Fold',
      'Russian Blue',
    ];
    const name = names[this.utilsService.getRandomInt(0, names.length - 1)];
    const age = this.utilsService.getRandomInt(1, 20);
    const breed = breeds[this.utilsService.getRandomInt(0, breeds.length - 1)];
    return { name, age, breed };
  };

  create = async () => {
    try {
      let counter = 0;
      while (true) {
        if (counter < CATS_CREATE_LIMIT) {
          const catsToInsert: Cat[] = [];
          for (let i = 0; i < BATCH_SIZE; ++i) {
            catsToInsert.push(this.generateRandomCat());
          }
          const response = await this.catsService.createMany(catsToInsert);
          this.logger.log(JSON.stringify(response));

          counter += BATCH_SIZE;
        } else {
          break;
        }
      }
    } catch (e) {}
  };
}
