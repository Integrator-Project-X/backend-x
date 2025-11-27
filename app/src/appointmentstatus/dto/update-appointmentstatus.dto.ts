// dto structure for update gender
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentstatusDto } from './appointmentstatus.dto';
import { IsOptional, IsIn } from 'class-validator';


// We use PartialType(ApiPropertyOptional) to create a type where
// All properties and validations in ApiPropertyOptional are optional.
export class UpdateAppointmentstatusDTO extends PartialType(AppointmentstatusDto) {
  @ApiPropertyOptional({
    type: 'string',
    nullable: true,
    example: null,
    description: 'Only null is allowed here to reactivate the Appointment status.',
  })
  @IsOptional()
  @IsIn([null], { message: 'deleted_at must be null. Use the soft-delete endpoint to deactivate.' })
  deleted_at?: null;
}

// Note: We don't need to repeat the properties again.