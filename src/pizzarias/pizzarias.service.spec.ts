import { Test, TestingModule } from '@nestjs/testing';
import { PizzariasService } from './pizzarias.service';

describe('PizzariasService', () => {
  let service: PizzariasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PizzariasService],
    }).compile();

    service = module.get<PizzariasService>(PizzariasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
