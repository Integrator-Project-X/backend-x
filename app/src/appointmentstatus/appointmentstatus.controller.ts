import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AppointmentstatusService } from './appointmentstatus.service';
import { AppointmentstatusDto } from './dto/appointmentstatus.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Appointment Status')
@Controller('appointment-status')
export class AppointmentstatusController {
    constructor(
        private readonly appointmentstatusService: AppointmentstatusService,
    ) { }

    // -------------------------------------------
    // CREATE
    // -------------------------------------------

    @Post()
    @ApiOperation({ summary: 'Create a new appointment status' })
    @ApiResponse({
        status: 201,
        description: 'Appointment status created successfully.',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid data provided.',
    })
    async create(@Body() dto: AppointmentstatusDto) {
        return await this.appointmentstatusService.createAppointmentStatus(dto);
    }

    // -------------------------------------------
    // GET ALL (ACTIVE + INACTIVE)
    // -------------------------------------------

    @Get()
    @ApiOperation({ summary: 'Get all appointment statuses' })
    @ApiResponse({
        status: 200,
        description: 'List of all appointment statuses.',
    })
    async findAll() {
        return await this.appointmentstatusService.findAllAppointmentStatuses();
    }

    // -------------------------------------------
    // GET ONLY ACTIVE
    // -------------------------------------------

    @Get('active')
    @ApiOperation({ summary: 'Get all ACTIVE appointment statuses' })
    @ApiResponse({
        status: 200,
        description: 'List of active appointment statuses.',
    })
    async findActive() {
        return await this.appointmentstatusService.findAllActiveAppointmentStatuses();
    }

    // -------------------------------------------
    // GET BY ID
    // -------------------------------------------

    @Get(':id')
    @ApiOperation({ summary: 'Get an appointment status by ID' })
    @ApiResponse({
        status: 200,
        description: 'Appointment status retrieved successfully.',
    })
    @ApiResponse({
        status: 404,
        description: 'Appointment status not found.',
    })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.appointmentstatusService.FindAppointmentStatusById(id);
    }

    // -------------------------------------------
    // UPDATE BY ID
    // -------------------------------------------

    @Patch(':id')
    @ApiOperation({ summary: 'Update an appointment status by ID' })
    @ApiResponse({
        status: 200,
        description: 'Appointment status updated successfully.',
    })
    @ApiResponse({
        status: 404,
        description: 'Appointment status not found.',
    })
    @ApiResponse({
        status: 500,
        description: 'Error updating appointment status.',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AppointmentstatusDto,
    ) {
        return await this.appointmentstatusService.updateAppointmentStatus(id, dto);
    }

    // -------------------------------------------
    // SOFT DELETE (SET isActive = false)
    // -------------------------------------------

    @Patch(':id/soft-delete')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Soft-delete an appointment status (sets isActive = false)',
    })
    @ApiResponse({
        status: 204,
        description: 'Appointment status soft-deleted successfully.',
    })
    @ApiResponse({
        status: 404,
        description: 'Appointment status not found.',
    })
    async softDelete(@Param('id', ParseIntPipe) id: number) {
        await this.appointmentstatusService.softDeleteAppointmentStatus(id);
    }
}
