import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AccessService } from './access.service';
import { AccessDto } from './dto/access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { Access } from './entities/access.entity';

@ApiTags('Access')
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) { }

  @Post()
  @ApiOperation({ summary: 'Create access credentials for a user' })
  @ApiBody({ type: AccessDto })
  @ApiResponse({ status: 201, description: 'Access created', type: Access })
  async create(@Body() dto: AccessDto): Promise<Access> {
    return await this.accessService.createAccess(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all access records' })
  @ApiResponse({ status: 200, type: [Access] })
  async findAll(): Promise<Access[]> {
    return await this.accessService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get access record by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Access })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Access> {
    return await this.accessService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update access record' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAccessDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccessDto,
  ): Promise<Access> {
    return await this.accessService.updateAccess(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Soft delete access (set isActive = false)' })
  @ApiParam({ name: 'id', type: Number })
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Access> {
    return await this.accessService.softDeleteAccess(id);
  }
}