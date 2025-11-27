import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentstypesService } from './appointmentstypes.service';

describe('AppointmentstypesService', () => {
  let service: AppointmentstypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentstypesService],
    }).compile();

    service = module.get<AppointmentstypesService>(AppointmentstypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
