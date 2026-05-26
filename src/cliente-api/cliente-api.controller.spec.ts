import { Test, TestingModule } from '@nestjs/testing';
import { ClienteApiController } from './cliente-api.controller';
import { ClienteApiService } from './cliente-api.service';

describe('ClienteApiController', () => {
  let controller: ClienteApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteApiController],
      providers: [ClienteApiService],
    }).compile();

    controller = module.get<ClienteApiController>(ClienteApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
