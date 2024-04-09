import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ClAppService {
  private readonly logger = new Logger(ClAppService.name);

  async test() {
    this.logger.log('test');
  }
}
