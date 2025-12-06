import { Test, TestingModule } from '@nestjs/testing';
import { PetUserController } from './pet_user.controller';
import { PetUserService } from './pet_user.service';

describe('PetUserController', () => {
  let controller: PetUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetUserController],
      providers: [PetUserService],
    }).compile();

    controller = module.get<PetUserController>(PetUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
