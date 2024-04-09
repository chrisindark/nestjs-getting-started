import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
export class HeaderAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers?.['Authorization']?.length
      ? request.headers?.['Authorization']
      : undefined;

    if (!authorizationHeader) {
      throw new UnauthorizedException();
    }
    const user =
      await this.authService.getUserByAuthorizationHeader(authorizationHeader);
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;

    return true;
  }
}
