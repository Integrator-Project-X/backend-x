import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personal } from './entities/personal.entity';
import { PersonalDto } from './dto/personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { User } from 'src/users/entities/user.entity';
import { JobPosition } from 'src/jobposition/entities/jobposition.entity';

@Injectable()
export class PersonalService {
  constructor(
    @InjectRepository(Personal)
    private readonly personalRepository: Repository<Personal>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(JobPosition)
    private readonly jobPositionRepository: Repository<JobPosition>,
  ) { }

  private async findPersonalById(id: number): Promise<Personal> {
    const personal = await this.personalRepository.findOne({
      where: { id_personal: id },
    });

    if (!personal) {
      throw new NotFoundException(`Personal with ID "${id}" not found`);
    }
    return personal;
  }

  async createPersonal(dto: PersonalDto): Promise<Personal> {
    try {
      const user = await this.userRepository.findOne({
        where: { id_user: dto.id_user },
      });
      if (!user) {
        throw new BadRequestException(
          `User with ID "${dto.id_user}" does not exist`,
        );
      }

      const job = await this.jobPositionRepository.findOne({
        where: { id_job_position: dto.id_job_position },
      });
      if (!job) {
        throw new BadRequestException(
          `Job position with ID "${dto.id_job_position}" does not exist`,
        );
      }

      const personal = this.personalRepository.create({
        user,
        jobPosition: job,
        isActive: dto.isActive ?? true,
      });

      return await this.personalRepository.save(personal);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error creating personal');
    }
  }

  async findAll(): Promise<Personal[]> {
    try {
      return await this.personalRepository.find();
    } catch {
      throw new InternalServerErrorException('Error retrieving personal list');
    }
  }

  async findOne(id: number): Promise<Personal> {
    try {
      return await this.findPersonalById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error retrieving personal');
    }
  }

  async updatePersonal(
    id: number,
    dto: UpdatePersonalDto,
  ): Promise<Personal> {
    try {
      const personal = await this.findPersonalById(id);

      if (dto.id_user) {
        const user = await this.userRepository.findOne({
          where: { id_user: dto.id_user },
        });
        if (!user) {
          throw new BadRequestException(
            `User with ID "${dto.id_user}" does not exist`,
          );
        }
        (personal as any).user = user;
      }

      if (dto.id_job_position) {
        const job = await this.jobPositionRepository.findOne({
          where: { id_job_position: dto.id_job_position },
        });
        if (!job) {
          throw new BadRequestException(
            `Job position with ID "${dto.id_job_position}" does not exist`,
          );
        }
        (personal as any).jobPosition = job;
      }

      if (dto.isActive !== undefined) {
        personal.isActive = dto.isActive;
      }

      return await this.personalRepository.save(personal);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating personal');
    }
  }

  async softDeletePersonal(id: number): Promise<Personal> {
    try {
      const personal = await this.findPersonalById(id);
      personal.isActive = false;
      return await this.personalRepository.save(personal);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting personal');
    }
  }
}