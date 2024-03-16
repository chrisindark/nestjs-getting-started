import {
  BadRequestException,
  Injectable,
  // InternalServerErrorException,
  // Logger,
} from '@nestjs/common';

import { SentryService } from 'src/interceptors/sentry/sentry.service';

@Injectable()
export class PingService {
  constructor(private readonly sentryService: SentryService) {}
  async ping() {
    return {
      message: 'pong',
    };
  }

  async pingDetail(id: string) {
    return {
      message: `pong: #${id}`,
    };
  }

  pingCatchWithSentry = async () => {
    try {
      throw Error('ping error message');
    } catch (e) {
      // const exceptionContextdata = {
      //   tags: {},
      //   extras: {},
      // };
      // this.sentryService.catchWithSentry(e, {}, exceptionContextdata);

      throw new BadRequestException({
        success: false,
        message: e.message,
      });
      // throw new InternalServerErrorException({
      //   success: false,
      //   message: e.message,
      // });
    }
  };

  pingAuthenticated = async (req) => {
    // Logger.log(req.user);

    return {
      message: 'authenticated pong',
    };
  };

  pingJwtAuthenticated = async (req) => {
    // Logger.log(req.user);

    return {
      message: 'authenticated pong',
    };
  };
}
