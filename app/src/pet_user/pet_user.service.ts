import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetUser } from './entities/pet_user.entity';
import { PetUserDto } from './dto/pet_user.dto';
import { UpdatePetUserDto } from './dto/update-pet_user.dto';
import { User } from 'src/users/entities/user.entity';
import { Pet } from 'src/pet/entities/pet.entity';

@Injectable()
export class PetUserService {
  constructor(
    @InjectRepository(PetUser)
    private readonly petUserRepository: Repository<PetUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) { }

  private async findPetUserById(id: number): Promise<PetUser> {
    const relation = await this.petUserRepository.findOne({
      where: { id_pet_user: id },
    });

    if (!relation) {
      throw new NotFoundException(`PetUser with ID "${id}" not found`);
    }

    return relation;
  }

  async createPetUser(dto: PetUserDto): Promise<PetUser> {
    try {
      const user = await this.userRepository.findOne({
        where: { id_user: dto.id_user },
      });
      if (!user) {
        throw new BadRequestException(
          `User with ID "${dto.id_user}" does not exist`,
        );
      }

      const pet = await this.petRepository.findOne({
        where: { id_pet: dto.id_pet },
      });
      if (!pet) {
        throw new BadRequestException(
          `Pet with ID "${dto.id_pet}" does not exist`,
        );
      }

      const existing = await this.petUserRepository.findOne({
        where: {
          user: { id_user: dto.id_user },
          pet: { id_pet: dto.id_pet },
        },
      });
      if (existing) {
        throw new BadRequestException(
          'This user is already associated with this pet',
        );
      }

      const relation = this.petUserRepository.create({
        user,
        pet,
        isActive: dto.isActive ?? true,
      });

      return await this.petUserRepository.save(relation);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error creating pet_user');
    }
  }

  async findAll(): Promise<PetUser[]> {
    try {
      return await this.petUserRepository.find();
    } catch {
      throw new InternalServerErrorException('Error retrieving pet_user list');
    }
  }

  async findOne(id: number): Promise<PetUser> {
    try {
      return await this.findPetUserById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error retrieving pet_user');
    }
  }

  async updatePetUser(
    id: number,
    dto: UpdatePetUserDto,
  ): Promise<PetUser> {
    try {
      const relation = await this.findPetUserById(id);

      if (dto.id_user) {
        const user = await this.userRepository.findOne({
          where: { id_user: dto.id_user },
        });
        if (!user) {
          throw new BadRequestException(
            `User with ID "${dto.id_user}" does not exist`,
          );
        }
        (relation as any).user = user;
      }

      if (dto.id_pet) {
        const pet = await this.petRepository.findOne({
          where: { id_pet: dto.id_pet },
        });
        if (!pet) {
          throw new BadRequestException(
            `Pet with ID "${dto.id_pet}" does not exist`,
          );
        }
        (relation as any).pet = pet;
      }

      if (dto.isActive !== undefined) {
        relation.isActive = dto.isActive;
      }

      return await this.petUserRepository.save(relation);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating pet_user');
    }
  }

  async softDeletePetUser(id: number): Promise<PetUser> {
    try {
      const relation = await this.findPetUserById(id);
      relation.isActive = false;
      return await this.petUserRepository.save(relation);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting pet_user');
    }
  }
}