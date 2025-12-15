import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateAppointmentStatusDto {
    @ApiProperty({ example: 2, description: 'ID of the new status' })
    @IsInt()
    @Min(1)
    id_status: number;
}