import { PartialType } from '@nestjs/swagger';
import { PersonalDto } from './personal.dto';

export class UpdatePersonalDto extends PartialType(PersonalDto) {}