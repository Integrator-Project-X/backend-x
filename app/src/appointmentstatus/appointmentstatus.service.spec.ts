import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentstatusService } from './appointmentstatus.service';

describe('AppointmentstatusService', () => {
  let service: AppointmentstatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentstatusService],
    }).compile();

    service = module.get<AppointmentstatusService>(AppointmentstatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
