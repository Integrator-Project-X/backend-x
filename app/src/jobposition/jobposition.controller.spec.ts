import { Test, TestingModule } from '@nestjs/testing';
import { JobpositionController } from './jobposition.controller';

describe('JobpositionController', () => {
  let controller: JobpositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobpositionController],
    }).compile();

    controller = module.get<JobpositionController>(JobpositionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
