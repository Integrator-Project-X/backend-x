import { Test, TestingModule } from '@nestjs/testing';
import { PetUserService } from './pet_user.service';

describe('PetUserService', () => {
  let service: PetUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetUserService],
    }).compile();

    service = module.get<PetUserService>(PetUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
