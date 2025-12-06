import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: UserDto })
    @ApiResponse({ status: 201, type: User })
    async create(@Body() dto: UserDto): Promise<User> {
        return this.usersService.createUser(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [User] })
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, type: User })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiParam({ name: 'id', type: Number })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.update(id, dto);
    }

    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Soft delete (deactivate) a user' })
    async deactivate(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.softDelete(id);
    }

    @Patch(':id/restore')
    @ApiOperation({ summary: 'Restore a user' })
    async restore(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.restore(id);
    }
}