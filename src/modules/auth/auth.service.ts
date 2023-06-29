import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

// import { UsersService } from "../../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    // private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // const users = await this.usersService.find(username);
    // if (users && users.length && users[0].password === password) {
    //   const { password, ...result } = users[0];
    //   return result;
    // }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
