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
import { ClinicScheduleService } from './clinic_schedule.service';
import { ClinicSchedule } from './entities/clinic_schedule.entity';
import { ClinicScheduleDto } from './dto/clinic_schedule.dto';

@ApiTags('Clinic Schedules')
@Controller('clinic-schedules')
export class ClinicScheduleController {
    constructor(
        private readonly clinicScheduleService: ClinicScheduleService,
    ) { }

    /**
     * Create a new clinic schedule
     */
    @Post()
    @ApiOperation({ summary: 'Create a new clinic schedule' })
    @ApiBody({
        description: 'Clinic schedule data',
        type: ClinicScheduleDto,
        examples: {
            example1: {
                summary: 'Weekday schedule',
                value: {
                    id_clinic: 1,
                    day_of_week: 'Monday',
                    open_time: '08:00:00',
                    close_time: '18:00:00',
                    isActive: true,
                },
            },
            example2: {
                summary: 'Weekend schedule',
                value: {
                    id_clinic: 1,
                    day_of_week: 'Saturday',
                    open_time: '09:00:00',
                    close_time: '14:00:00',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Clinic schedule created successfully',
        schema: {
            example: {
                id_clinic_schedule: 1,
                day_of_week: 'Monday',
                open_time: '08:00:00',
                close_time: '18:00:00',
                isActive: true,
                createdAt: '2025-11-30T12:00:00.000Z',
                updatedAt: '2025-11-30T12:00:00.000Z',
                clinic: {
                    id_clinic: 1,
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    isActive: true,
                    createdAt: '2025-11-29T10:00:00.000Z',
                    updatedAt: '2025-11-29T10:00:00.000Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request - invalid data',
        schema: {
            example: {
                statusCode: 400,
                message: 'Failed to create clinic schedule',
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
    async createClinicSchedule(
        @Body() createClinicScheduleDto: ClinicScheduleDto,
    ): Promise<ClinicSchedule> {
        return await this.clinicScheduleService.createClinicSchedule(
            createClinicScheduleDto,
        );
    }

    /**
     * Get all clinic schedules (active and inactive)
     */
    @Get()
    @ApiOperation({ summary: 'Get all clinic schedules' })
    @ApiResponse({
        status: 200,
        description: 'List of all clinic schedules',
        schema: {
            example: [
                {
                    id_clinic_schedule: 1,
                    day_of_week: 'Monday',
                    open_time: '08:00:00',
                    close_time: '18:00:00',
                    isActive: true,
                    createdAt: '2025-11-30T12:00:00.000Z',
                    updatedAt: '2025-11-30T12:00:00.000Z',
                    clinic: {
                        id_clinic: 1,
                        clinic_name: 'Happy Pets Veterinary Center',
                        address: 'Calle 84 #45-67',
                        phone_number: '3001234567',
                        identification_number: '900456789',
                        isActive: true,
                        createdAt: '2025-11-29T10:00:00.000Z',
                        updatedAt: '2025-11-29T10:00:00.000Z',
                    },
                },
                {
                    id_clinic_schedule: 2,
                    day_of_week: 'Saturday',
                    open_time: '09:00:00',
                    close_time: '14:00:00',
                    isActive: false,
                    createdAt: '2025-11-30T12:10:00.000Z',
                    updatedAt: '2025-11-30T12:20:00.000Z',
                    clinic: {
                        id_clinic: 1,
                        clinic_name: 'Happy Pets Veterinary Center',
                        address: 'Calle 84 #45-67',
                        phone_number: '3001234567',
                        identification_number: '900456789',
                        isActive: true,
                        createdAt: '2025-11-29T10:00:00.000Z',
                        updatedAt: '2025-11-29T10:00:00.000Z',
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving clinic schedules',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error retrieving clinic schedules',
                error: 'Internal Server Error',
            },
        },
    })
    async findAllClinicSchedules(): Promise<ClinicSchedule[]> {
        return await this.clinicScheduleService.findAllClinicSchedules();
    }

    /**
     * Get all active clinic schedules (isActive = true)
     */
    @Get('active')
    @ApiOperation({ summary: 'Get all active clinic schedules' })
    @ApiResponse({
        status: 200,
        description: 'List of all active clinic schedules',
        schema: {
            example: [
                {
                    id_clinic_schedule: 1,
                    day_of_week: 'Monday',
                    open_time: '08:00:00',
                    close_time: '18:00:00',
                    isActive: true,
                    createdAt: '2025-11-30T12:00:00.000Z',
                    updatedAt: '2025-11-30T12:00:00.000Z',
                    clinic: {
                        id_clinic: 1,
                        clinic_name: 'Happy Pets Veterinary Center',
                        address: 'Calle 84 #45-67',
                        phone_number: '3001234567',
                        identification_number: '900456789',
                        isActive: true,
                        createdAt: '2025-11-29T10:00:00.000Z',
                        updatedAt: '2025-11-29T10:00:00.000Z',
                    },
                },
            ],
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error retrieving active clinic schedules',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error retrieving active clinic schedules',
                error: 'Internal Server Error',
            },
        },
    })
    async findAllActiveClinicSchedules(): Promise<ClinicSchedule[]> {
        return await this.clinicScheduleService.findAllActiveClinicSchedules();
    }

    /**
     * Get a clinic schedule by ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get a clinic schedule by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic schedule ID' })
    @ApiResponse({
        status: 200,
        description: 'Clinic schedule found',
        schema: {
            example: {
                id_clinic_schedule: 1,
                day_of_week: 'Monday',
                open_time: '08:00:00',
                close_time: '18:00:00',
                isActive: true,
                createdAt: '2025-11-30T12:00:00.000Z',
                updatedAt: '2025-11-30T12:00:00.000Z',
                clinic: {
                    id_clinic: 1,
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    isActive: true,
                    createdAt: '2025-11-29T10:00:00.000Z',
                    updatedAt: '2025-11-29T10:00:00.000Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Clinic schedule not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Clinic Schedule with ID "99" not found',
                error: 'Not Found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error finding clinic schedule',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error finding clinic schedule',
                error: 'Internal Server Error',
            },
        },
    })
    async findClinicScheduleById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ClinicSchedule> {
        return await this.clinicScheduleService.FindClinicScheduleById(id);
    }

    /**
     * Update a clinic schedule by ID
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update a clinic schedule by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic schedule ID' })
    @ApiBody({
        type: ClinicScheduleDto,
        description: 'Updated clinic schedule data',
        examples: {
            updateExample: {
                summary: 'Change opening and closing time',
                value: {
                    open_time: '09:00:00',
                    close_time: '17:00:00',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Clinic schedule updated successfully',
        schema: {
            example: {
                id_clinic_schedule: 1,
                day_of_week: 'Monday',
                open_time: '09:00:00',
                close_time: '17:00:00',
                isActive: true,
                createdAt: '2025-11-30T12:00:00.000Z',
                updatedAt: '2025-11-30T13:00:00.000Z',
                clinic: {
                    id_clinic: 1,
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    isActive: true,
                    createdAt: '2025-11-29T10:00:00.000Z',
                    updatedAt: '2025-11-29T10:00:00.000Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Clinic schedule not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Clinic Schedule with ID "99" not found',
                error: 'Not Found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error updating clinic schedule',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error updating clinic schedule',
                error: 'Internal Server Error',
            },
        },
    })
    async updateClinicSchedule(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateClinicScheduleDto: ClinicScheduleDto,
    ): Promise<ClinicSchedule> {
        return await this.clinicScheduleService.updateClinicSchedule(
            id,
            updateClinicScheduleDto,
        );
    }

    /**
     * Deactivate (soft-delete) a clinic schedule by ID
     */
    @Patch(':id/deactivate')
    @ApiOperation({
        summary: 'Deactivate (soft-delete) a clinic schedule by ID',
    })
    @ApiParam({ name: 'id', type: Number, description: 'Clinic schedule ID' })
    @ApiResponse({
        status: 200,
        description: 'Clinic schedule deactivated successfully',
        schema: {
            example: {
                id_clinic_schedule: 1,
                day_of_week: 'Monday',
                open_time: '08:00:00',
                close_time: '18:00:00',
                isActive: false,
                createdAt: '2025-11-30T12:00:00.000Z',
                updatedAt: '2025-11-30T13:30:00.000Z',
                clinic: {
                    id_clinic: 1,
                    clinic_name: 'Happy Pets Veterinary Center',
                    address: 'Calle 84 #45-67',
                    phone_number: '3001234567',
                    identification_number: '900456789',
                    isActive: true,
                    createdAt: '2025-11-29T10:00:00.000Z',
                    updatedAt: '2025-11-29T10:00:00.000Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Clinic schedule not found',
        schema: {
            example: {
                statusCode: 404,
                message: 'Clinic Schedule with ID "99" not found',
                error: 'Not Found',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Error deleting clinic schedule',
        schema: {
            example: {
                statusCode: 500,
                message: 'Error deleting clinic schedule',
                error: 'Internal Server Error',
            },
        },
    })
    async softDeleteClinicSchedule(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ClinicSchedule> {
        return await this.clinicScheduleService.softDeleteClinicSchedule(id);
    }
}
