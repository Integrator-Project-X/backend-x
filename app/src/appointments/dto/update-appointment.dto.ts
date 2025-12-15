import { PartialType } from '@nestjs/swagger';
import { AdminAppointmentDto } from './admin-appointment.dto';

export class UpdateAppointmentDto extends PartialType(AdminAppointmentDto) {}