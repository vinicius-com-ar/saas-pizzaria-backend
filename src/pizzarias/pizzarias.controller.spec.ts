import { Test, TestingModule } from '@nestjs/testing';
import { PizzariasController } from './pizzarias.controller';

describe('PizzariasController', () => {
  let controller: PizzariasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PizzariasController],
    }).compile();

    controller = module.get<PizzariasController>(PizzariasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
