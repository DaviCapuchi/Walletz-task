import { Test, TestingModule } from '@nestjs/testing';
import { ClienteApiService } from './cliente-api.service';

describe('ClienteApiService', () => {
  let service: ClienteApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClienteApiService],
    }).compile();

    service = module.get<ClienteApiService>(ClienteApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
