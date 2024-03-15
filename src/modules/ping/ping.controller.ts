import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PingService } from 'src/modules/ping/ping.service';
import { CookieAuthGuard } from '../auth/cookie-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get('/')
  ping(): any {
    return this.pingService.ping();
  }

  @Get('/:id')
  pingDetail(@Param('id') id: string): any {
    return this.pingService.pingDetail(id);
  }

  @Get('/catch-with-sentry')
  pingCatchWithSentry(): any {
    return this.pingService.pingCatchWithSentry();
  }

  @UseGuards(CookieAuthGuard)
  @Get('/ping-authenticated')
  pingAuthenticated(@Req() req): any {
    return this.pingService.pingAuthenticated(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/ping-jwt-authenticated')
  pingJwtAuthenticated(@Req() req): any {
    return this.pingService.pingJwtAuthenticated(req);
  }
}
