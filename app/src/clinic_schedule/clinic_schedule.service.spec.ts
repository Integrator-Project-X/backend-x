import { Test, TestingModule } from '@nestjs/testing';
import { ClinicScheduleService } from './clinic_schedule.service';

describe('ClinicScheduleService', () => {
  let service: ClinicScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicScheduleService],
    }).compile();

    service = module.get<ClinicScheduleService>(ClinicScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
