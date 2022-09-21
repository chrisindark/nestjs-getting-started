import { Controller, Get } from "@nestjs/common";
// import Utils from "src/utils";

import { AppService } from "./app.service";

@Controller("api/v1")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/get-info")
  getHello(): string {
    return this.appService.getInfo();
  }
}
