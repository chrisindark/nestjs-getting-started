import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MyLibraryService {
  async init(): Promise<void> {
    Logger.debug("MyLibraryService");
    return null;
  }
}
