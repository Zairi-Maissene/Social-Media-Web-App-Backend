import { Test, TestingModule } from '@nestjs/testing';
import { DbSeederService } from './db-seeder.service';

describe('DbSeederService', () => {
  let service: DbSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbSeederService],
    }).compile();

    service = module.get<DbSeederService>(DbSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
