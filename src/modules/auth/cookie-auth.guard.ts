import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";

import { LOGIN_COOKIE_NAME } from "src/constants/constants";
import { AuthService } from "./auth.service";

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const loginPass = request.cookies[LOGIN_COOKIE_NAME];

    if (!loginPass) {
      // Logger.debug(
      //   `AUTHGUARD no cookie - ${request.url}
      //   ${JSON.stringify(request.query)}`,
      // );
      throw new UnauthorizedException();
    }

    const cookie = loginPass.split("-")[1];
    if (!cookie) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
