import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getInfo(): any {
    return {
      name: "internal-tools-kafka",
    };
  }
}
