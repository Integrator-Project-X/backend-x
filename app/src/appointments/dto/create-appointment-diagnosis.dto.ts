import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsString } from 'class-validator';

export class CreateAppointmentDiagnosisDto {
    @ApiProperty({ example: 2, description: 'Personal ID' })
    @IsInt()
    @Min(1)
    id_personal: number;

    @ApiProperty({ example: 'Otitis', description: 'Diagnosis Description' })
    @IsString()
    description: string;
}