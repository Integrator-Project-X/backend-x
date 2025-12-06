import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { ClinicService } from './clinic.service';
import { Clinic } from './entities/clinic.entity';
import { ClinicDto } from './dto/clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicController {
    constructor(private readonly clinicService: ClinicService) { }

    /**
     * Create a new clinic (supports image upload)
     */
    @Post()
    @ApiOperation({ summary: 'Create a new clinic (supports image upload)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Clinic data (with optional image)',
        type: ClinicDto,
    })
    @UseInterceptors(FileInterceptor('image'))
    async createClinic(
        @Body() createClinicDto: ClinicDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Clinic> {
        return await this.clinicService.createClinic(createClinicDto, file);
    }

    /**
     * Get all clinics (active and inactive)
     */
    @Get()
    @ApiOperation({ summary: 'Get all clinics' })
    async findAllClinics(): Promise<Clinic[]> {
        return await this.clinicService.findAllClinics();
    }

    /**
     * Get all active clinics (isActive = true)
     */
    @Get('active')
    @ApiOperation({ summary: 'Get all active clinics' })
    async findAllActiveClinics(): Promise<Clinic[]> {
        return await this.clinicService.findAllActiveClinics();
    }

    /**
     * Get a clinic by ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get a clinic by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
    async findClinicById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Clinic> {
        return await this.clinicService.FindClinicById(id);
    }

    /**
     * Update a clinic by ID (supports image upload)
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update a clinic by ID (supports image upload)' })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: UpdateClinicDto,
        description: 'Updated clinic data (image optional)',
    })
    @UseInterceptors(FileInterceptor('image'))
    async updateClinic(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateClinicDto: UpdateClinicDto,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<Clinic> {
        return await this.clinicService.updateClinic(id, updateClinicDto, file);
    }
    /**
     * Deactivate (soft-delete) a clinic by ID (set isActive = false)
     */
    @Patch(':id/deactivate')
    @ApiOperation({
        summary: 'Deactivate (soft-delete) a clinic by ID',
    })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
    async softDeleteClinic(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Clinic> {
        return await this.clinicService.softDeleteClinic(id);
    }
}
