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
    constructor(private readonly clinicService: ClinicService) {}

    // ---------------------------------------------------------
    // CREATE CLINIC (supports image upload)
    // ---------------------------------------------------------
    @Post()
    @ApiOperation({ summary: 'Create a new clinic (supports image upload)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Clinic data. Supports optional image upload via field `image`.',
        type: ClinicDto,
        examples: {
            example1: {
                summary: 'Clinic with image',
                value: {
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67, Barranquilla',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    isActive: true,
                    // image is sent as a file, not JSON
                },
            },
            example2: {
                summary: 'Clinic without image',
                value: {
                    clinic_name: 'PetLife Clinic',
                    address: 'Cra 43 #72-10, Barranquilla',
                    phone_number: '3015558899',
                    identification_number: '901234567',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Clinic created successfully',
        schema: {
            example: {
                id_clinic: 1,
                clinic_name: 'Happy Pets Veterinary Center',
                address: 'Calle 84 #45-67',
                phone_number: '3001234567',
                identification_number: '900456789',
                image_url:
                    'https://supabase-url.storage/v1/object/public/clinics/happypets.png',
                isActive: true,
                createdAt: '2025-12-06T10:00:00.000Z',
                updatedAt: '2025-12-06T10:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request — invalid data or duplicate identification number',
        schema: {
            example: {
                statusCode: 400,
                message: 'Failed to create clinic',
                error: 'Bad Request',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
            },
        },
    })
    @UseInterceptors(FileInterceptor('image'))
    async createClinic(
        @Body() createClinicDto: ClinicDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Clinic> {
        return await this.clinicService.createClinic(createClinicDto, file);
    }

    // ---------------------------------------------------------
    // GET ALL CLINICS
    // ---------------------------------------------------------
    @Get()
    @ApiOperation({ summary: 'Get all clinics (active and inactive)' })
    @ApiResponse({
        status: 200,
        description: 'List of all clinics',
        schema: {
            example: [
                {
                    id_clinic: 1,
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    image_url:
                        'https://supabase-url.storage/v1/object/public/clinics/happypets.png',
                    isActive: true,
                },
                {
                    id_clinic: 2,
                    clinic_name: 'PetLife Clinic',
                    address: 'Cra 43 #72-10',
                    phone_number: '3015558899',
                    identification_number: '901234567',
                    image_url: null,
                    isActive: false,
                },
            ],
        },
    })
    async findAllClinics(): Promise<Clinic[]> {
        return await this.clinicService.findAllClinics();
    }

    // ---------------------------------------------------------
    // GET ACTIVE CLINICS
    // ---------------------------------------------------------
    @Get('active')
    @ApiOperation({ summary: 'Get all active clinics' })
    @ApiResponse({
        status: 200,
        description: 'List of active clinics',
        schema: {
            example: [
                {
                    id_clinic: 1,
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    image_url:
                        'https://supabase-url.storage/v1/object/public/clinics/happypets.png',
                    isActive: true,
                },
            ],
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Server error retrieving clinics',
    })
    async findAllActiveClinics(): Promise<Clinic[]> {
        return await this.clinicService.findAllActiveClinics();
    }

    // ---------------------------------------------------------
    // GET CLINIC BY ID
    // ---------------------------------------------------------
    @Get(':id')
    @ApiOperation({ summary: 'Get a clinic by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
    @ApiResponse({
        status: 200,
        description: 'Clinic found',
        schema: {
            example: {
                id_clinic: 1,
                clinic_name: 'Happy Pets Veterinary Center',
                address: 'Calle 84 #45-67',
                phone_number: '3001234567',
                identification_number: '900456789',
                image_url:
                    'https://supabase-url.storage/v1/object/public/clinics/happypets.png',
                isActive: true,
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Clinic not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Clinic with ID "99" not found',
                error: 'Not Found',
            },
        },
    })
    async findClinicById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Clinic> {
        return await this.clinicService.FindClinicById(id);
    }

    // ---------------------------------------------------------
    // UPDATE CLINIC (supports image upload)
    // ---------------------------------------------------------
    @Patch(':id')
    @ApiOperation({ summary: 'Update a clinic (supports image upload)' })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: UpdateClinicDto,
        description:
            'Fields to update. All are optional. Image is uploaded via the `image` file field.',
        examples: {
            example1: {
                summary: 'Update address & phone',
                value: {
                    address: 'Calle 90 #40-02',
                    phone_number: '3105551234',
                },
            },
            example2: {
                summary: 'Update only the clinic image',
                value: {},
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Clinic updated successfully',
        schema: {
            example: {
                id_clinic: 1,
                clinic_name: 'Happy Pets Veterinary Center',
                address: 'Calle 90 #40-02',
                phone_number: '3105551234',
                identification_number: '900456789',
                image_url:
                    'https://supabase-url.storage/v1/object/public/clinics/happypets-new.png',
                isActive: true,
                createdAt: '2025-12-06T10:00:00.000Z',
                updatedAt: '2025-12-06T12:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Clinic not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Clinic with ID "99" not found',
                error: 'Not Found',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request — invalid fields or upload failure',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error while updating clinic',
    })
    @UseInterceptors(FileInterceptor('image'))
    async updateClinic(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateClinicDto: UpdateClinicDto,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<Clinic> {
        return await this.clinicService.updateClinic(id, updateClinicDto, file);
    }

    // ---------------------------------------------------------
    // SOFT DELETE CLINIC
    // ---------------------------------------------------------
    @Patch(':id/deactivate')
    @ApiOperation({
        summary: 'Deactivate (soft-delete) a clinic by ID',
    })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
    @ApiResponse({
        status: 200,
        description: 'Clinic deactivated successfully',
        schema: {
            example: {
                id_clinic: 1,
                clinic_name: 'Happy Pets Veterinary Center',
                address: 'Calle 84 #45-67',
                phone_number: '3001234567',
                identification_number: '900456789',
                image_url:
                    'https://supabase-url.storage/v1/object/public/clinics/happypets.png',
                isActive: false,
                updatedAt: '2025-12-06T13:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Clinic not found',
    })
    @ApiResponse({
        status: 500,
        description: 'Error deactivating clinic',
    })
    async softDeleteClinic(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Clinic> {
        return await this.clinicService.softDeleteClinic(id);
    }
}
