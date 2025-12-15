import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PetUserService } from './pet_user.service';
import { PetUserDto } from './dto/pet_user.dto';
import { UpdatePetUserDto } from './dto/update-pet_user.dto';
import { PetUser } from './entities/pet_user.entity';
import { Roles } from 'src/auth/decorators/roles.deco';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Pet User')
@Controller('pet-user')
export class PetUserController {
  constructor(private readonly petUserService: PetUserService) { }

  @Post()
  @ApiOperation({ summary: 'Create relation between user and pet' })
  @ApiBody({ type: PetUserDto })
  @ApiResponse({
    status: 201,
    description: 'Relation created successfully',
    type: PetUser,
  })
  async create(@Body() dto: PetUserDto): Promise<PetUser> {
    return await this.petUserService.createPetUser(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all user–pet relations' })
  @ApiResponse({ status: 200, type: [PetUser] })
  async findAll(): Promise<PetUser[]> {
    return await this.petUserService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user–pet relation by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: PetUser })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PetUser> {
    return await this.petUserService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user–pet relation' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePetUserDto })
  @ApiResponse({ status: 200, type: PetUser })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePetUserDto,
  ): Promise<PetUser> {
    return await this.petUserService.updatePetUser(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Soft delete relation (isActive = false)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: PetUser })
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PetUser> {
    return await this.petUserService.softDeletePetUser(id);
  }
}