import { Controller, Get } from '@nestjs/common';

import { CronService } from './cron.service';

@Controller('api/v1/cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Get('/')
  cron(): any {
    return this.cronService.cron();
  }
}
