import {
  Controller,
  Get,
  Req,
  Res,
  HttpStatus,
  Post,
  Body,
} from "@nestjs/common";
import { Request, Response } from "express";

import { CreateCatDto } from "./dto/create-cat.dto";
import { CatsService } from "./cats.service";
import { Cat } from "./interfaces/cat.interface";

@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  // @Get()
  // findAll(@Req() request: Request, @Res() res: Response) {
  //   const apiRes = {
  //     success: true,
  //     cats: []
  //   };
  //   return res.status(HttpStatus.OK).json(apiRes);
  // }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  // @Post()
  // async create(@Res() res: Response) {
  //   res.status(HttpStatus.CREATED).json();
  // }
}
