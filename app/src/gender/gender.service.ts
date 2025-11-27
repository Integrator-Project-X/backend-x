import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from './entities/gender.entity';
import { GenderDto } from './dto/gender.dto';


@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
  ) { }
  // Method to create a new gender
  async createGender(createGenderDto: GenderDto): Promise<Gender> {
    try {
      const gender = this.genderRepository.create(createGenderDto);
      return await this.genderRepository.save(gender);

    } catch (error) {
      throw new BadRequestException('Failed to create gender');
    }
  }
  // Method to find all genders
  async findAllGenders(): Promise<Gender[]> {
    return await this.genderRepository.find();
  }

  // Method to find all active genders  
  async findAllActiveGenders(): Promise<Gender[]> {
    return await this.genderRepository.find({ where: { isActive: true } });
  }
  // Method to get a gender by ID
  async FindGenderById(id: number): Promise<Gender> {
    try {
      const gender = await this.genderRepository.findOne({ where: { id_gender: id } });
      if (!gender) {
        throw new NotFoundException(`Gender with ID "${id}" not found`);
      }
      return gender;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding gender');
    }
  }

  // Method to find a gender by name
  async getGenderByName(name: string): Promise<Gender> {
    try {
      const gender = await this.genderRepository.findOne({
        where: { name: name as any } // Using type assertion to handle the type issue
      });

      if (!gender) {
        throw new NotFoundException(`Gender with name "${name}" not found`);
      }
      return gender;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting gender');
    }
  }

  //Method to update a gender by ID
  async updateGender(id: number, updateGenderDto: Partial<GenderDto>): Promise<Gender> {
    try {
      const gender = await this.FindGenderById(id);
      Object.assign(gender, updateGenderDto);
      return await this.genderRepository.save(gender);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating gender');
    }
  }

  //Method to delete a gender by ID
  async deleteGenderById(id: number): Promise<{ message: string }> {
    try {

      if (id === null || id === undefined || id === 0) {
        throw new NotFoundException("Gender not found");
      }
      const result = await this.genderRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Gender delete "${id}" not found`);
      }
      return { message: `Gender with ID "${id}" deleted successfully` };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting gender');
    }
  }

}
