import { PartialType } from '@nestjs/swagger';
import { AppointmentDto } from './admin-appointment.dto';

export class UpdateAppointmentDto extends PartialType(AppointmentDto) {}