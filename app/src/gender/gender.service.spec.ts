import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GenderService } from './gender.service';
import { GenderDto } from './dto/gender.dto';
import { Gender } from './entities/gender.entity';
import { BadRequestException } from '@nestjs/common';

// Simplified mock repository type to avoid TypeORM generic constraints in tests
type MockRepository = Partial<Record<string, jest.Mock>>;

const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

// call the function test
describe('GenderService', () => {
  let service: GenderService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenderService,
        { provide: getRepositoryToken(Gender), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<GenderService>(GenderService);
    repository = module.get(getRepositoryToken(Gender));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //-----create-----

  describe('create', () => {
    it('creates and returns a gender', async () => {
      const dto: GenderDto = {name: 'Masculine', isActive: true };
      const saved = { id: 'uuid-1', ...dto };
      repository.create!.mockReturnValue(dto);
      repository.save!.mockResolvedValue(saved);

      await expect(service.createGender(dto)).resolves.toEqual(saved);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(dto);
    });

    it('throws BadRequestException on database error', async () => {
      const dto: GenderDto = { name: 'ErrorName', isActive: true };
      // Simulation of database error
      repository.save!.mockRejectedValue(new Error('DB Error')); 
      repository.create!.mockReturnValue(dto);

      await expect(service.createGender(dto)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  //-----findAll-----

  describe('findAll', () => {
    it('returns an array of genders', async () => {
      const items = [{ id_gender: 1, name: 'Feminine' }];
      repository.find!.mockResolvedValue(items);
      await expect(service.findAllGenders()).resolves.toEqual(items);
      expect(repository.find).toHaveBeenCalled();
    });
  });


  //-----findAllActive-----

  describe('findAllActive', () => {
    it('returns an array of active genders', async () => {
      const items = [{ id_gender: 1, name: 'Feminine' }];
      repository.find!.mockResolvedValue(items);
      await expect(service.findAllActiveGenders()).resolves.toEqual(items);
      expect(repository.find).toHaveBeenCalled();
    });
  });



  //-----findById-----

  describe('findById', () => {
    it('returns a gender when found', async () => {
      const item = {name: 'Feminine' };
      repository.findOne!.mockResolvedValue(item);
      await expect(service.FindGenderById(1)).resolves.toEqual(item);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id_gender: 1 } });
    });

    it('throws NotFoundException when not found', async () => {
      repository.findOne!.mockResolvedValue(undefined);
      await expect(service.FindGenderById(999)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws InternalServerErrorException on database find error', async () => {
      // Simulation of database error
      repository.findOne!.mockRejectedValue(new Error('Network Error'));
      await expect(service.FindGenderById(1)).rejects.toBeInstanceOf(InternalServerErrorException);
      // NOTE FOR ME: Ensure that NotFoundException is not thrown, but the service error is wrapped
      await expect(service.FindGenderById(1)).rejects.toHaveProperty('response.message', 'Error finding gender');
    });
  });


  //-----getByName-----

  describe('getByName', () => {
    it('returns a gender when found', async () => {
      const item = {name: 'Feminine' };
      repository.findOne!.mockResolvedValue(item);
      await expect(service.getGenderByName('Feminine')).resolves.toEqual(item);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: 'Feminine' } });
    });
    //-----getByName-----

  describe('getByName', () => {
    it('returns a gender when found', async () => {
      const item = { id_gender: 2, name: 'Feminine' } as Gender;
      repository.findOne!.mockResolvedValue(item);
      await expect(service.getGenderByName('Feminine')).resolves.toEqual(item);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: 'Feminine' } });
    });

    //handle error
    it('throws NotFoundException when not found', async () => {
      repository.findOne!.mockResolvedValue(undefined);
      await expect(service.getGenderByName('NonExistent')).rejects.toBeInstanceOf(NotFoundException);
    });
    it('throws InternalServerErrorException on database find error', async () => {
      repository.findOne!.mockRejectedValue(new Error('Connection timed out'));
      await expect(service.getGenderByName('AnyName')).rejects.toBeInstanceOf(InternalServerErrorException);
      await expect(service.getGenderByName('AnyName')).rejects.toHaveProperty('response.message', 'Error getting gender');
    });
  });
  });



  //-----update-----

  describe('update', () => {
    it('updates and returns the updated gender', async () => {
      const original = { name: 'Old' } as any;
      const updateDto = { name: 'Feminine' } as Partial<GenderDto>;
      const saved = { ...original, ...updateDto };

      // findOne is used internally by update
      repository.findOne!.mockResolvedValue(original);
      repository.save!.mockResolvedValue(saved);

      await expect(service.updateGender(1, updateDto)).resolves.toEqual(saved);
      expect(repository.save).toHaveBeenCalledWith(original);
    });
    //handle error
    it('throws NotFoundException when not found', async () => {
      repository.findOne!.mockResolvedValue(undefined);
      await expect(service.updateGender(999, { name: 'Feminine' } as Partial<GenderDto>)).rejects.toBeInstanceOf(NotFoundException);
    });
    it('throws InternalServerErrorException on database find error', async () => {
      repository.findOne!.mockRejectedValue(new Error('Connection timed out'));
      await expect(service.updateGender(1, { name: 'Feminine' } as Partial<GenderDto>)).rejects.toBeInstanceOf(InternalServerErrorException);
      await expect(service.updateGender(1, { name: 'Feminine' } as Partial<GenderDto>)).rejects.toHaveProperty('response.message', 'Error updating gender');
    });
    });

  //-----removeById-----

  describe('removeById', () => {
    it('removes successfully when affected > 0', async () => {
      repository.delete!.mockResolvedValue({ affected: 1 } as any);
      await expect(service.deleteGenderById(1));
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when id is null, undefined, or 0', async () => {
      //taste null
      await expect(service.deleteGenderById(null as any)).rejects.toBeInstanceOf(NotFoundException);
      //taste 0
      await expect(service.deleteGenderById(0)).rejects.toBeInstanceOf(NotFoundException);
      
      expect(repository.delete).not.toHaveBeenCalled(); //NOTE FOR ME: check if the delete method was called
    });

    it('throws InternalServerErrorException on database delete error', async () => {
      repository.delete!.mockRejectedValue(new Error('Connection lost'));
      
      await expect(service.deleteGenderById(1)).rejects.toBeInstanceOf(InternalServerErrorException);
      await expect(service.deleteGenderById(1)).rejects.toHaveProperty('response.message', 'Error deleting gender');
    });
  });
});
