import { PartialType } from '@nestjs/swagger';
import { AccessDto } from './access.dto';

export class UpdateAccessDto extends PartialType(AccessDto) {}