import {
    Injectable,
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
    ) { }

    // Method to create a new role
    async createRole(createRoleDto: RoleDto): Promise<Role> {
        try {
            const role = this.rolesRepository.create(createRoleDto);
            return await this.rolesRepository.save(role);
        } catch (error: any) {
            // Error de unique constraint en Postgres
            if (error?.code === '23505') {
                throw new BadRequestException('Role name must be unique');
            }
            throw new InternalServerErrorException('Error creating role');
        }
    }

    // Method to find all roles
    async findAllRoles(): Promise<Role[]> {
        try {
            return await this.rolesRepository.find();
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving roles');
        }
    }

    // Method to find all active roles
    async findAllActiveRoles(): Promise<Role[]> {
        try {
            return await this.rolesRepository.find({ where: { isActive: true } });
        } catch (error) {
            throw new InternalServerErrorException('Error retrieving active roles');
        }
    }

    // Method to get a role by ID
    async findRoleById(id: number): Promise<Role> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required');
        }

        try {
            const role = await this.rolesRepository.findOne({
                where: { id_role: id },
            });

            if (!role) {
                throw new NotFoundException(`Role with id ${id} not found`);
            }

            return role;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error finding role');
        }
    }

    // Method to update a role by ID
    async updateRole(id: number, updateRoleDto: UpdateRoleDTO): Promise<Role> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required');
        }

        try {
            const role = await this.findRoleById(id);
            Object.assign(role, updateRoleDto);
            return await this.rolesRepository.save(role);
        } catch (error: any) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            if (error?.code === '23505') {
                throw new BadRequestException('Role name must be unique');
            }
            throw new InternalServerErrorException('Error updating role');
        }
    }

    // Method to soft-delete (deactivate) a role by ID
    async softDeleteRole(id: number): Promise<Role> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required');
        }

        try {
            const role = await this.findRoleById(id);
            role.isActive = false;
            return await this.rolesRepository.save(role);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deactivating role');
        }
    }
}
