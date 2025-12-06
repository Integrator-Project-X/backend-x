import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';

@ApiTags('Roles') // Grupo de Swagger
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    /**
     * Create a new role
     */
    @Post()
    @ApiOperation({ summary: 'Create a new role' })
    @ApiBody({ type: RoleDto, description: 'Role data' })
    @ApiResponse({ status: 201, description: 'Role created successfully', type: Role })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data or duplicate role_name' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createRole(@Body() createRoleDto: RoleDto): Promise<Role> {
        return await this.rolesService.createRole(createRoleDto);
    }

    /**
     * Get all roles (active and inactive)
     */
    @Get()
    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({ status: 200, description: 'List of all roles', type: [Role] })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async findAllRoles(): Promise<Role[]> {
        return await this.rolesService.findAllRoles();
    }

    /**
     * Get all active roles (isActive = true)
     */
    @Get('active')
    @ApiOperation({ summary: 'Get all active roles' })
    @ApiResponse({ status: 200, description: 'List of all active roles', type: [Role] })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async findAllActiveRoles(): Promise<Role[]> {
        return await this.rolesService.findAllActiveRoles();
    }

    /**
     * Get a role by its ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get a role by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Role found', type: Role })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid id' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async findRoleById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Role> {
        return await this.rolesService.findRoleById(id);
    }

    /**
     * Update an existing role by its ID
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update a role by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
    @ApiBody({ type: UpdateRoleDTO, description: 'Updated role data' })
    @ApiResponse({ status: 200, description: 'Role updated successfully', type: Role })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid id or data' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDTO,
    ): Promise<Role> {
        return await this.rolesService.updateRole(id, updateRoleDto);
    }

    /**
     * Deactivate (soft-delete) a role by its ID
     */
    @Patch(':id/desactivate')
    @ApiOperation({ summary: 'Desactivate (soft-delete) a role by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Role deactivated successfully', type: Role })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid id' })
    @ApiResponse({ status: 404, description: 'Role not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async softDeleteRole(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Role> {
        return await this.rolesService.softDeleteRole(id);
    }
}
