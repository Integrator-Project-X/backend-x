import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateAppointmentDto {
    @ApiProperty({ example: 1, description: 'Pet ID from the Pets entity' })
    @IsInt()
    @Min(1)
    id_pet: number;

    @ApiProperty({ example: 1, description: 'Vet ID' })
    @IsInt()
    @Min(1)
    id_clinic: number;

    @ApiProperty({ example: 1, description: 'Type of Appointment ID' })
    @IsInt()
    @Min(1)
    id_type: number;

    @ApiProperty({
        example: 'General control',
        description: 'Description / prupose of the appointment',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
}