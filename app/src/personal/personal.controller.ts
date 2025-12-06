import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PersonalService } from './personal.service';
import { PersonalDto } from './dto/personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { Personal } from './entities/personal.entity';

@ApiTags('Personal')
@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) { }

  @Post()
  @ApiOperation({ summary: 'Create new staff member' })
  @ApiBody({ type: PersonalDto })
  @ApiResponse({ status: 201, description: 'Personal created', type: Personal })
  async create(@Body() dto: PersonalDto): Promise<Personal> {
    return await this.personalService.createPersonal(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all staff' })
  @ApiResponse({ status: 200, type: [Personal] })
  async findAll(): Promise<Personal[]> {
    return await this.personalService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get staff member by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Personal })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Personal> {
    return await this.personalService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update staff member' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePersonalDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonalDto,
  ): Promise<Personal> {
    return await this.personalService.updatePersonal(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Soft delete staff member (isActive = false)' })
  @ApiParam({ name: 'id', type: Number })
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Personal> {
    return await this.personalService.softDeletePersonal(id);
  }
}