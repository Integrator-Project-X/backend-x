import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Gender } from 'src/gender/entities/gender.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Gender)
        private readonly genderRepository: Repository<Gender>,
    ) { }

    async createUser(dto: UserDto): Promise<User> {
        const gender = await this.genderRepository.findOne({
            where: { id_gender: dto.id_gender },
        });
        if (!gender) {
            throw new BadRequestException(
                `Gender with id ${dto.id_gender} does not exist`,
            );
        }
        const exists = await this.usersRepository.findOne({
            where: { identification_number: dto.identification_number },
        });
        if (exists) {
            throw new BadRequestException(
                'A user with this identification already exists',
            );
        }

        const user = this.usersRepository.create({
            full_name: dto.full_name,
            age: dto.age,
            address: dto.address,
            phone_number: dto.phone_number,
            identification_number: dto.identification_number,
            gender,
        });

        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.usersRepository.find();
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving users');
        }
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id_user: id },
        });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async update(id: number, dto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (dto.id_gender) {
            const gender = await this.genderRepository.findOne({
                where: { id_gender: dto.id_gender },
            });
            if (!gender) {
                throw new BadRequestException(
                    `Gender with id ${dto.id_gender} does not exist`,
                );
            }
            (user as any).gender = gender;
        }

        Object.assign(user, dto);

        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException('Error updating user');
        }
    }

    async softDelete(id: number): Promise<User> {
        const user = await this.findOne(id);
        user.isActive = false;
        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException('Error deleting user');
        }
    }

    async restore(id: number): Promise<User> {
        const user = await this.findOne(id);
        user.isActive = true;
        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException('Error restoring user');
        }
    }
}