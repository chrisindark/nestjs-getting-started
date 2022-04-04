import { Module } from "@nestjs/common";
import { MyOtherLibraryService } from "./my-other-library.service";

@Module({
  providers: [MyOtherLibraryService],
  exports: [MyOtherLibraryService],
})
export class MyOtherLibraryModule {}
