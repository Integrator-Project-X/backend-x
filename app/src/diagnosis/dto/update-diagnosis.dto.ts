import { PartialType } from '@nestjs/swagger';
import { DiagnosisDto } from './diagnosis.dto';

export class UpdatePersonalDto extends PartialType(DiagnosisDto) {}

// Note: We don't need to repeat the properties again.