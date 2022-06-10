import { Injectable } from "@nestjs/common";
import { MyLibraryService } from "@christopherpaul/my-library/dist";
import { MyOtherLibraryService } from "@christopherpaul/my-other-library";

@Injectable()
export class AppService {
  constructor(
    private readonly myLibraryService: MyLibraryService,
    private readonly myOtherLibraryService: MyOtherLibraryService,
  ) {
    this.init();
  }

  init() {
    this.myLibraryService.init();
    this.myOtherLibraryService.init();
  }

  getInfo(): any {
    return {
      name: "internal-tools-kafka",
    };
  }
}
