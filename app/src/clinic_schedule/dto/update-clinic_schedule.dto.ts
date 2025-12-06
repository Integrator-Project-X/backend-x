import { PartialType } from '@nestjs/swagger';
import { ClinicScheduleDto } from './clinic_schedule.dto';

export class UpdateClinicScheduleDto extends PartialType(ClinicScheduleDto) {}
// Note: We don't need to repeat the properties again.