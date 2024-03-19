import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  CreateCatBody,
  // FilterCatBody,
  GetCatParam,
  GetCatsQuery,
  UpdateCatBody,
} from './cats.interface';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  // curl --location 'localhost:3000/v1/cats?limit=1&offset=1'
  @Get('/')
  async getCats(@Query() query: GetCatsQuery) {
    return this.catsService.getCats(query);
  }

  // curl --location 'localhost:3000/v1/cats/create' \
  // --header 'Content-Type: application/json' \
  // --data '{
  //     "name": "Chris",
  //     "age": 5,
  //     "breed": "Leo"
  // }'
  @Post('/create')
  async createCat(@Body() body: CreateCatBody) {
    return this.catsService.createCat(body);
  }

  // curl --location 'localhost:3000/v1/cats/65f6fddfac699abfdce2b193'
  @Get('/:_id')
  async getCatById(@Param() params: GetCatParam) {
    return this.catsService.filterCatById(params);
  }

  @Post('/update/:_id')
  async updateCat(
    @Req() req: Request,
    @Param() params: GetCatParam,
    @Body() body: UpdateCatBody,
    @Res() res: Response,
  ) {
    console.log(req.headers);
    console.log(params);
    console.log(body);
    return res.status(HttpStatus.OK).json();
  }
}
