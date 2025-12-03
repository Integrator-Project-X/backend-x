import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Access } from './entities/access.entity';
import { AccessDto } from './dto/access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access)
    private readonly accessRepository: Repository<Access>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  private async findAccessById(id: number): Promise<Access> {
    const access = await this.accessRepository.findOne({
      where: { id_access: id },
    });
    if (!access) {
      throw new NotFoundException(`Access with ID "${id}" not found`);
    }
    return access;
  }

  async createAccess(dto: AccessDto): Promise<Access> {
    try {
      const user = await this.userRepository.findOne({
        where: { id_user: dto.id_user },
      });
      if (!user) {
        throw new BadRequestException(
          `User with ID "${dto.id_user}" does not exist`,
        );
      }

      const role = await this.roleRepository.findOne({
        where: { id_role: dto.id_role },
      });
      if (!role) {
        throw new BadRequestException(
          `Role with ID "${dto.id_role}" does not exist`,
        );
      }

      const existing = await this.accessRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new BadRequestException('Email is already in use');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(dto.password, salt);

      const access = this.accessRepository.create({
        email: dto.email,
        password: passwordHash,
        isActive: dto.isActive ?? true,
        user,
        role,
      });

      return await this.accessRepository.save(access);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error creating access');
    }
  }

  async findAll(): Promise<Access[]> {
    try {
      return await this.accessRepository.find();
    } catch {
      throw new InternalServerErrorException('Error finding access records');
    }
  }

  async findOne(id: number): Promise<Access> {
    try {
      return await this.findAccessById(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error finding access record');
    }
  }

  async updateAccess(id: number, dto: UpdateAccessDto): Promise<Access> {
    try {
      const access = await this.findAccessById(id);

      if (dto.email && dto.email !== access.email) {
        const existing = await this.accessRepository.findOne({
          where: { email: dto.email },
        });
        if (existing) {
          throw new BadRequestException('Email is already in use');
        }
        access.email = dto.email;
      }

      if (dto.password) {
        const salt = await bcrypt.genSalt(10);
        access.password = await bcrypt.hash(dto.password, salt);
      }

      if (dto.id_user) {
        const user = await this.userRepository.findOne({
          where: { id_user: dto.id_user },
        });
        if (!user) {
          throw new BadRequestException(
            `User with ID "${dto.id_user}" does not exist`,
          );
        }
        (access as any).user = user;
      }

      if (dto.id_role) {
        const role = await this.roleRepository.findOne({
          where: { id_role: dto.id_role },
        });
        if (!role) {
          throw new BadRequestException(
            `Role with ID "${dto.id_role}" does not exist`,
          );
        }
        (access as any).role = role;
      }

      if (dto.isActive !== undefined) {
        access.isActive = dto.isActive;
      }

      return await this.accessRepository.save(access);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating access record');
    }
  }

  async softDeleteAccess(id: number): Promise<Access> {
    try {
      const access = await this.findAccessById(id);
      access.isActive = false;
      return await this.accessRepository.save(access);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting access record');
    }
  }
}