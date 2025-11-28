import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from './entities/gender.entity';
import { GenderDto } from './dto/gender.dto';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
  ) {}

  // Helper para validar ID
  private ensureValidId(id: number): void {
    if (!id || id <= 0 || Number.isNaN(id)) {
      throw new BadRequestException('A valid id is required');
    }
  }

  // Method to create a new gender
  async createGender(createGenderDto: GenderDto): Promise<Gender> {
    try {
      const gender = this.genderRepository.create(createGenderDto);
      return await this.genderRepository.save(gender);
    } catch (error: any) {
      // Si el nombre es único en DB
      if (error?.code === '23505') {
        throw new BadRequestException('Gender name must be unique');
      }
      throw new InternalServerErrorException('Failed to create gender');
    }
  }

  // Method to find all genders
  async findAllGenders(): Promise<Gender[]> {
    try {
      return await this.genderRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving genders');
    }
  }

  // Method to find all active genders
  async findAllActiveGenders(): Promise<Gender[]> {
    try {
      return await this.genderRepository.find({ where: { isActive: true } });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving active genders');
    }
  }

  // Method to get a gender by ID
  async findGenderById(id: number): Promise<Gender> {
    this.ensureValidId(id);

    try {
      const gender = await this.genderRepository.findOne({
        where: { id_gender: id },
      });

      if (!gender) {
        throw new NotFoundException(`Gender with ID "${id}" not found`);
      }

      return gender;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding gender');
    }
  }

  // Method to find a gender by name
  async getGenderByName(name: string): Promise<Gender> {
    if (!name || !name.trim()) {
      throw new BadRequestException('A valid name is required');
    }

    try {
      const gender = await this.genderRepository.findOne({
        where: { name: name as any }, // depende de cómo se llame la propiedad en la entidad
      });

      if (!gender) {
        throw new NotFoundException(`Gender with name "${name}" not found`);
      }

      return gender;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting gender');
    }
  }

  // Method to update a gender by ID
  async updateGender(id: number, updateGenderDto: Partial<GenderDto>): Promise<Gender> {
    this.ensureValidId(id);

    try {
      const gender = await this.findGenderById(id);
      Object.assign(gender, updateGenderDto);
      return await this.genderRepository.save(gender);
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error?.code === '23505') {
        throw new BadRequestException('Gender name must be unique');
      }
      throw new InternalServerErrorException('Error updating gender');
    }
  }

  // Method to delete a gender by ID
  async deleteGenderById(id: number): Promise<{ message: string }> {
    this.ensureValidId(id);

    try {
      const result = await this.genderRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Gender with ID "${id}" not found`);
      }

      return { message: `Gender with ID "${id}" deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting gender');
    }
  }
}
