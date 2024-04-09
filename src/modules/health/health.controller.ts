import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  // TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    // private db: TypeOrmHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get('/http')
  @HealthCheck()
  async checkHttpHealth(): Promise<any> {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @Get('/')
  @HealthCheck()
  check() {
    const healthCheckUrl = `${this.configService.get('BASE_URL')}/v1/ping`;
    return this.health.check([
      () => this.http.pingCheck('ping', healthCheckUrl),
    ]);
  }
}
