import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { AppointmentDto } from './dto/appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cita' })
  @ApiBody({ type: AppointmentDto })
  @ApiResponse({ status: 201, type: Appointment })
  async create(@Body() dto: AppointmentDto): Promise<Appointment> {
    return await this.appointmentsService.createAppointment(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las citas' })
  @ApiResponse({ status: 200, type: [Appointment] })
  async findAll(): Promise<Appointment[]> {
    return await this.appointmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cita por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Appointment })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Appointment> {
    return await this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cita' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, type: Appointment })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentsService.updateAppointment(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Soft delete de una cita (isActive = false)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Appointment })
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Appointment> {
    return await this.appointmentsService.softDeleteAppointment(id);
  }
}