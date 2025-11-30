import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { ClinicService } from './clinic.service';
import { Clinic } from './entities/clinic.entity';
import { ClinicDto } from './dto/clinic.dto';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicController {
    constructor(private readonly clinicService: ClinicService) { }

    /**
     * Create a new clinic
     */
    @Post()
    @ApiOperation({ summary: 'Create a new clinic' })
    @ApiBody({
        description: 'Clinic data',
        type: ClinicDto,
        examples: {
            example1: {
                summary: 'Standard clinic',
                value: {
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67, Barranquilla',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    isActive: true,
                },
            },
            example2: {
                summary: 'Another clinic',
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
                address: 'Calle 84 #45-67, Barranquilla',
                phone_number: '3001234567',
                identification_number: '900456789',
                isActive: true,
                createdAt: '2025-11-30T10:00:00.000Z',
                updatedAt: '2025-11-30T10:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request - invalid data or duplicate fields',
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
    async createClinic(@Body() createClinicDto: ClinicDto): Promise<Clinic> {
        return await this.clinicService.createClinic(createClinicDto);
    }

    /**
     * Get all clinics (active and inactive)
     */
    @Get()
    @ApiOperation({ summary: 'Get all clinics' })
    @ApiResponse({
        status: 200,
        description: 'List of all clinics',
        schema: {
            example: [
                {
                    id_clinic: 1,
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67, Barranquilla',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    isActive: true,
                    createdAt: '2025-11-30T10:00:00.000Z',
                    updatedAt: '2025-11-30T10:00:00.000Z',
                },
                {
                    id_clinic: 2,
                    clinic_name: 'PetLife Clinic',
                    address: 'Cra 43 #72-10, Barranquilla',
                    phone_number: '3015558899',
                    identification_number: '901234567',
                    isActive: false,
                    createdAt: '2025-11-30T11:00:00.000Z',
                    updatedAt: '2025-11-30T12:00:00.000Z',
                },
            ],
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving clinics',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error retrieving clinics',
                error: 'Internal Server Error',
            },
        },
    })
    async findAllClinics(): Promise<Clinic[]> {
        return await this.clinicService.findAllClinics();
    }

    /**
     * Get all active clinics (isActive = true)
     */
    @Get('active')
    @ApiOperation({ summary: 'Get all active clinics' })
    @ApiResponse({
        status: 200,
        description: 'List of all active clinics',
        schema: {
            example: [
                {
                    id_clinic: 1,
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67, Barranquilla',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    isActive: true,
                    createdAt: '2025-11-30T10:00:00.000Z',
                    updatedAt: '2025-11-30T10:00:00.000Z',
                },
            ],
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving active clinics',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error retrieving active clinics',
                error: 'Internal Server Error',
            },
        },
    })
    async findAllActiveClinics(): Promise<Clinic[]> {
        return await this.clinicService.findAllActiveClinics();
    }

    /**
     * Get a clinic by ID
     */
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
                address: 'Calle 84 #45-67, Barranquilla',
                phone_number: '3001234567',
                identification_number: '900456789',
                isActive: true,
                createdAt: '2025-11-30T10:00:00.000Z',
                updatedAt: '2025-11-30T10:00:00.000Z',
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
        status: 500,
        description: 'Error finding clinic',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error finding clinic',
                error: 'Internal Server Error',
            },
        },
    })
    async findClinicById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Clinic> {
        return await this.clinicService.FindClinicById(id);
    }

    /**
     * Update a clinic by ID
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update a clinic by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
    @ApiBody({
        type: ClinicDto,
        description: 'Updated clinic data',
        examples: {
            updateExample: {
                summary: 'Update address and phone',
                value: {
                    address: 'Calle 90 #40-02, Barranquilla',
                    phone_number: '3105551234',
                },
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
                address: 'Calle 90 #40-02, Barranquilla',
                phone_number: '3105551234',
                identification_number: '900456789',
                isActive: true,
                createdAt: '2025-11-30T10:00:00.000Z',
                updatedAt: '2025-11-30T13:00:00.000Z',
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
        status: 500,
        description: 'Error updating clinic',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error updating clinic',
                error: 'Internal Server Error',
            },
        },
    })
    async updateClinic(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateClinicDto: ClinicDto,
    ): Promise<Clinic> {
        return await this.clinicService.updateClinic(id, updateClinicDto);
    }

    /**
     * Deactivate (soft-delete) a clinic by ID (set isActive = false)
     */
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
                address: 'Calle 84 #45-67, Barranquilla',
                phone_number: '3001234567',
                identification_number: '900456789',
                isActive: false,
                createdAt: '2025-11-30T10:00:00.000Z',
                updatedAt: '2025-11-30T14:00:00.000Z',
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
        status: 500,
        description: 'Error deleting clinic',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error deleting clinic',
                error: 'Internal Server Error',
            },
        },
    })
    async softDeleteClinic(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Clinic> {
        return await this.clinicService.softDeleteClinic(id);
    }
}
