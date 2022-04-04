import { Test, TestingModule } from '@nestjs/testing';
import { MyOtherLibraryService } from './my-other-library.service';

describe('MyOtherLibraryService', () => {
  let service: MyOtherLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyOtherLibraryService],
    }).compile();

    service = module.get<MyOtherLibraryService>(MyOtherLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
