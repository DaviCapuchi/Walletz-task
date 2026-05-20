import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseRulesController } from './database-rules.controller';
import { DatabaseRulesService } from './database-rules.service';

describe('DatabaseRulesController', () => {
  let controller: DatabaseRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseRulesController],
      providers: [DatabaseRulesService],
    }).compile();

    controller = module.get<DatabaseRulesController>(DatabaseRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
