import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentstatusController } from './appointmentstatus.controller';

describe('AppointmentstatusController', () => {
  let controller: AppointmentstatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentstatusController],
    }).compile();

    controller = module.get<AppointmentstatusController>(AppointmentstatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
