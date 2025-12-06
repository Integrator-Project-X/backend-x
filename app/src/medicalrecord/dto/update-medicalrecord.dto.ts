import { PartialType } from '@nestjs/swagger';
import { MedicalRecordDto } from './medicalrecord.dto';

export class UpdateMedicalRecordDto extends PartialType(MedicalRecordDto) {}
