import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import * as jwtStrategy from 'src/auth/strategies/jwt.strategy';

// DTO's
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateAppointmentDiagnosisDto } from './dto/create-appointment-diagnosis.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-status.dto';

// Decorators
import { CurrentUser } from 'src/auth/decorators/current-user.deco';
import { Roles } from 'src/auth/decorators/roles.deco';
import { Ownership } from 'src/auth/decorators/ownership.deco';

// Guards
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  @Roles('CLIENT', 'ADMIN')
  @ApiOperation({ summary: 'Creates a new Appointment from the CLient/Admin Side' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({ status: 201, type: Appointment })
  async create(@CurrentUser() user: jwtStrategy.JwtUser, @Body() dto: CreateAppointmentDto): Promise<Appointment> {
    return await this.appointmentsService.createForClient(user, dto);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all Appointments' })
  @ApiResponse({ status: 200, type: [Appointment] })
  async findAll(): Promise<Appointment[]> {
    return await this.appointmentsService.findAll();
  }

  @Get('me')
  @Roles('CLIENT', 'ADMIN')
  @ApiOperation({ summary: 'My Appointments ( Client Side )' })
  async myAppointments(@CurrentUser() user: jwtStrategy.JwtUser): Promise<Appointment[]> {
    return this.appointmentsService.findMine(user.userId);
  }

  @Get('clinic')
  @Roles('VET', 'ADMIN')
  @ApiOperation({ summary: 'My Appointments ( VET Side )' })
  async clinicAppointments(@CurrentUser() user: jwtStrategy.JwtUser): Promise<Appointment[]> {
    return this.appointmentsService.findForClinic(user);
  }

  @Get(':id')
  @Roles('CLIENT', 'VET', 'ADMIN')
  @UseGuards(OwnershipGuard)
  @Ownership({ resource: 'APPOINTMENT', param: 'ID', allowRoles: ['ADMIN'] })
  @ApiOperation({ summary: 'Obtener una cita por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: Appointment })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    return await this.appointmentsService.findOne(id);
  }

  @Patch(':id/cancel')
  @Roles('CLIENT', 'ADMIN')
  @UseGuards(OwnershipGuard)
  @Ownership({ resource: 'APPOINTMENT', param: 'id', allowRoles: ['ADMIN'] })
  async cancel(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    return this.appointmentsService.cancel(id);
  }

  @Patch(':id/status')
  @Roles('VET', 'ADMIN')
  @UseGuards(OwnershipGuard)
  @Ownership({ resource: 'APPOINTMENT', param: 'id', allowRoles: ['ADMIN'] })
  async setStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppointmentStatusDto): Promise<Appointment> {
    return this.appointmentsService.setStatus(id, dto.id_status);
  }

  @Patch(':id/diagnosis')
  @Roles('VET', 'ADMIN')
  @UseGuards(OwnershipGuard)
  @Ownership({ resource: 'APPOINTMENT', param: 'id', allowRoles: ['ADMIN'] })
  async createDiagnosis(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAppointmentDiagnosisDto,
  ): Promise<Appointment> {
    return this.appointmentsService.createDiagnosisForAppointment(id, dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar una cita' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ status: 200, type: Appointment })
  async update( @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppointmentDto ): Promise<Appointment> {
    return await this.appointmentsService.updateAppointment(id, dto);
  }
}