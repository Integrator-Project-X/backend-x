import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.deco';
import { ApiAuthDoc } from 'src/swagger/decorators/api-auth.deco';
import { CurrentUser } from 'src/auth/decorators/current-user.deco';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as jwtStrategy from 'src/auth/strategies/jwt.strategy';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiBearerAuth('access-token')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getMe(@CurrentUser() user: jwtStrategy.JwtUser ) {
    return this.usersService.findMe(user);
    }

    @Post()
    @Roles('ADMIN')
    @ApiAuthDoc({ roles: ['ADMIN'] })
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: UserDto })
    @ApiResponse({ status: 201, type: User })
    async create(@Body() dto: UserDto): Promise<User> {
        return this.usersService.createUser(dto);
    }

    @Get()
    @Roles('ADMIN')
    @ApiAuthDoc({ roles: ['ADMIN'] })
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [User] })
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles('ADMIN')
    @ApiAuthDoc({ roles: ['ADMIN'] })
    @ApiOperation({ summary: 'Get a user by id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, type: User })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN')
    @ApiAuthDoc({ roles: ['ADMIN'] })
    @ApiOperation({ summary: 'Update a user' })
    @ApiParam({ name: 'id', type: Number })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.update(id, dto);
    }

    @Patch(':id/deactivate')
    @Roles('ADMIN')
    @ApiAuthDoc({ roles: ['ADMIN'] })
    @ApiOperation({ summary: 'Soft delete (deactivate) a user' })
    async deactivate(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.softDelete(id);
    }

    @Patch(':id/restore')
    @Roles('ADMIN')
    @ApiAuthDoc({ roles: ['ADMIN'] })
    @ApiOperation({ summary: 'Restore a user' })
    async restore(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.restore(id);
    }
}