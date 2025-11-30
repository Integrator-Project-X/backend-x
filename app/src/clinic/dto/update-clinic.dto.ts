import { PartialType } from '@nestjs/swagger';
import { ClinicDto } from './clinic.dto';

export class UpdateClinicDto extends PartialType(ClinicDto) {}
// Note: We don't need to repeat the properties again.