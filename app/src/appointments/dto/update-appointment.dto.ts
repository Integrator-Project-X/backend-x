import { PartialType } from '@nestjs/swagger';
import { AppointmentDto } from './appointment.dto';

export class UpdateAppointmentDto extends PartialType(AppointmentDto) {}