import { Test, TestingModule } from '@nestjs/testing';
import { ClinicScheduleController } from './clinic_schedule.controller';

describe('ClinicScheduleController', () => {
  let controller: ClinicScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicScheduleController],
    }).compile();

    controller = module.get<ClinicScheduleController>(ClinicScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
