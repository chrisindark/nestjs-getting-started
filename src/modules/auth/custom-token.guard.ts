import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CUSTOM_TOKEN_HEADER_NAME } from '../../constants/constants';

@Injectable()
export class DeveloperApiTokenAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader =
      request.headers && request.headers[CUSTOM_TOKEN_HEADER_NAME];
    const [headerApiKey, headerApiSecret] = authorizationHeader?.length
      ? authorizationHeader.split(':')
      : [undefined, undefined];

    if (!headerApiKey || !headerApiSecret) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.getUserByCustomApiKeyAndApiSecret(
      headerApiKey,
      headerApiSecret,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;

    return true;
  }
}
