import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Person } from './person.entity';
import { Person as PersonInterface } from './interfaces/person.interface';
import {
  CreatePersonBody,
  GetPersonParam,
  GetPersonQuery,
} from './person.interface';
import { ServiceResponseStatus } from '../../constants/enums';

// import { SentryService } from 'src/interceptors/sentry/sentry.service';

@Injectable()
export class PersonService {
  private readonly logger = new Logger(PersonService.name);

  constructor(
    @InjectRepository(Person, 'test')
    private personsRepository: Repository<Person>,
  ) {}

  async getPerson() {
    return {
      message: 'person',
    };
  }

  create = async (payload: PersonInterface) => {
    try {
      const { firstName, lastName, address, city } = payload;
      const person = new Person();
      person.firstName = firstName;
      person.lastName = lastName;
      person.address = address || '';
      person.city = city || '';
      const response = await this.personsRepository.insert(person);
      return response;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new InternalServerErrorException(e.message);
    }
  };

  createPerson = async (body: CreatePersonBody) => {
    try {
      const { firstName, lastName, address, city } = body;
      const payload = { firstName, lastName, address, city };
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

  findPersons = async (limit: number, offset: number) => {
    try {
      return await this.personsRepository.find({
        take: limit,
        skip: offset,
      });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new InternalServerErrorException(e.message);
    }
  };

  getAllPersons = async (query: GetPersonQuery) => {
    try {
      const { limit, offset } = query;
      const response = await this.findPersons(limit, offset);
      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response,
      };
    } catch (e) {
      //   this.logger.error(e.message, e.stack);
      return {
        success: false,
        status: ServiceResponseStatus.FAIL,
        response: null,
      };
    }
  };

  getPersonById = async (id: number) => {
    try {
      const response = await this.personsRepository.findOne({
        where: {
          id,
        },
      });
      return response;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new InternalServerErrorException(e.message);
    }
  };

  filterPersonById = async (params: GetPersonParam) => {
    try {
      const { id } = params;
      const response = await this.getPersonById(id);
      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response,
      };
    } catch (e) {
      //   this.logger.error(e.message, e.stack);
      return {
        success: false,
        status: ServiceResponseStatus.FAIL,
        response: null,
      };
    }
  };
}
