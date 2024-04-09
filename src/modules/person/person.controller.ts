import {
  Body,
  Controller,
  Get,
  HttpStatus,
  // Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  // UseGuards,
} from '@nestjs/common';

import { PersonService } from './person.service';
import {
  CreatePersonBody,
  GetPersonParam,
  GetPersonQuery,
  UpdatePersonBody,
} from './person.interface';
import { Response } from 'express';
// import { CookieAuthGuard } from '../auth/cookie-auth.guard';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // curl --location 'localhost:3000/v1/person?limit=10&offset=1'
  @Get('/')
  async getAllPersons(@Query() query: GetPersonQuery) {
    return this.personService.getAllPersons(query);
  }

  @Post('/create')
  async createPerson(@Body() body: CreatePersonBody) {
    return this.personService.createPerson(body);
  }

  // curl --location 'localhost:3000/v1/person/3'
  @Get('/:id')
  async getPersonById(@Param() params: GetPersonParam) {
    return this.personService.filterPersonById(params);
  }

  @Post('/update/:_id')
  async updatePerson(
    @Req() req: Request,
    @Param() params: GetPersonParam,
    @Body() body: UpdatePersonBody,
    @Res() res: Response,
  ) {
    console.log(req.headers);
    console.log(params);
    console.log(body);
    return res.send(HttpStatus.OK).json();
  }
}
