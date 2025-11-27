// dto structure for update gender
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { GenderDto } from './gender.dto';
import { IsOptional, IsIn } from 'class-validator';


// We use PartialType(CreateGenderDTO) to create a type where
// All properties and validations in CreateGenderDTO are optional.
export class UpdateGenderDTO extends PartialType(GenderDto) {
  @ApiPropertyOptional({
    type: 'string',
    nullable: true,
    example: null,
    description: 'Only null is allowed here to reactivate the gender.',
  })
  @IsOptional()
  @IsIn([null], { message: 'deleted_at must be null. Use the soft-delete endpoint to deactivate.' })
  deleted_at?: null;
}

// Note: We don't need to repeat the properties again.