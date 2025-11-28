import { Test, TestingModule } from '@nestjs/testing';
import { JobpositionService } from './jobposition.service';

describe('JobpositionService', () => {
  let service: JobpositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobpositionService],
    }).compile();

    service = module.get<JobpositionService>(JobpositionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
