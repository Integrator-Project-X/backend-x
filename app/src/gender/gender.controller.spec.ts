
// test structure for gender controller
import { Test, TestingModule } from '@nestjs/testing';
import { GenderController } from './gender.controller';
import { GenderService } from './gender.service';
import { GenderDto } from './dto/gender.dto';

// call the function test
describe('GenderController', () => {
  let controller: GenderController;
  const mockService = {
    createGender: jest.fn(),
    findAllGenders: jest.fn(),
    FindGenderById: jest.fn(),
    updateGender: jest.fn(),
    deleteGenderById: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenderController],
      providers: [{ provide: GenderService, useValue: mockService }],
    }).compile();

    controller = module.get<GenderController>(GenderController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

// Test the create endpoint
  describe('create', () => {
    it('delegates to service.create', async () => {
      const dto: GenderDto = { name: 'Masculine', isActive: true  };
      const result = { id: 1, ...dto };
      mockService.createGender.mockResolvedValue(result);
      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(mockService.createGender).toHaveBeenCalledWith(dto);
    });
  });

// Test the findAll endpoint
  describe('findAll', () => {
    it('delegates to service.findAll', async () => {
      const items = [{name: 'Femenine' }];
      mockService.findAllGenders.mockResolvedValue(items);
      await expect(controller.findAllGenders()).resolves.toEqual(items);
    });
  });

// Test the findOne endpoint
  describe('findOne', () => {
    it('delegates to service.findOne', async () => {
      const item = {name: 'Other' };
      mockService.FindGenderById.mockResolvedValue(item);
      await expect(controller.FindGenderById(1)).resolves.toEqual(item);
      expect(mockService.FindGenderById).toHaveBeenCalledWith(1);
    });
  });

// Test the update endpoint
  describe('update', () => {
    it('delegates to service.update', async () => {
      const updated = {name:'Feminine' };
      mockService.updateGender.mockResolvedValue(updated);
      await expect(controller.updateGender(1, { name: 'Feminine' }));
      expect(mockService.updateGender).toHaveBeenCalledWith(1, { name: 'Feminine' });
    });
  });

// Test the remove endpoint
  describe('remove', () => {
    it('delegates to service.deleteGenderById', async () => {
      mockService.deleteGenderById.mockResolvedValue(undefined);
      await expect(controller.remove(1)).resolves.toBeUndefined();
      expect(mockService.deleteGenderById).toHaveBeenCalledWith(1);
    });
  });
});
