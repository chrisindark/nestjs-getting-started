import { Controller, Get } from "@nestjs/common";
// import Utils from "src/utils";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfo(): string {
    return this.appService.getInfo();
  }
}
