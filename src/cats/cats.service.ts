import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { Cat } from './interfaces/cat.interface';
import { FilterCatBody, GetCatParam, GetCatsQuery } from './cats.interface';
import { ServiceResponseStatus } from '../constants/enums';
import { Cats } from './cats.entity';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];
  private readonly logger = new Logger(CatsService.name);

  constructor(
    @InjectRepository(Cats, 'testMongo')
    private readonly catsRepository: MongoRepository<Cats>,
  ) {}

  create = async (payload: Cat) => {
    try {
      const { name, age, breed } = payload;
      const cat = new Cats();
      cat.name = name;
      cat.age = age;
      cat.breed = breed;
      const response = await this.catsRepository.insert(cat);
      return response;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new InternalServerErrorException(e.message);
    }
  };

  createCat = async (body: CreateCatDto) => {
    try {
      const { name, age, breed } = body;
      const payload: Cat = { name, age, breed };
      const response = await this.create(payload);
      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return {
        success: false,
        status: ServiceResponseStatus.FAIL,
        response: null,
      };
    }
  };

  getCatById = async (_id: string) => {
    try {
      const response = await this.catsRepository.findOne({
        where: {
          _id: new ObjectId(_id),
        },
      });
      return response;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new InternalServerErrorException(e.message);
    }
  };

  filterCatById = async (params: GetCatParam) => {
    try {
      const { _id } = params;
      const response = await this.getCatById(_id);
      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return {
        success: false,
        status: ServiceResponseStatus.FAIL,
        response: null,
      };
    }
  };

  findCats = async (limit: number, offset: number) => {
    try {
      return await this.catsRepository.find({
        take: limit,
        skip: offset,
      });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new InternalServerErrorException(e.message);
    }
  };

  getCats = async (query: GetCatsQuery) => {
    try {
      const { limit, offset } = query;
      const response = await this.findCats(limit, offset);
      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response: response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return {
        success: false,
        status: ServiceResponseStatus.FAIL,
        response: null,
      };
    }
  };

  filterCats = async (body: FilterCatBody) => {
    const { limit, offset, name, age, breed } = body;
    // const payload: GetCatsQuery = {
    //   limit,
    //   offset,
    // };

    try {
      const response = await this.findCats(limit, offset);

      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response: response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return {
        success: false,
        status: ServiceResponseStatus.FAIL,
        response: null,
      };
    }
  };
}
