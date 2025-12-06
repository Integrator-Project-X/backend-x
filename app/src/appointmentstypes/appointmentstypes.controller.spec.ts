import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentstypesController } from './appointmentstypes.controller';

describe('AppointmentstypesController', () => {
  let controller: AppointmentstypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentstypesController],
    }).compile();

    controller = module.get<AppointmentstypesController>(AppointmentstypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
