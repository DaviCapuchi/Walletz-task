import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseRulesService } from './database-rules.service';

describe('DatabaseRulesService', () => {
  let service: DatabaseRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseRulesService],
    }).compile();

    service = module.get<DatabaseRulesService>(DatabaseRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
