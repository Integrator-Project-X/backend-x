import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class MedicalRecordDto {
    @ApiProperty({
        description: 'Pet ID associated with this medical record',
        example: 5,
    })
    @IsInt()
    @IsNotEmpty()
    id_pet: number;

    @ApiProperty({
        description: 'Diagnosis ID associated with this medical record',
        example: 12,
    })
    @IsInt()
    @IsNotEmpty()
    id_diagnosis: number;

    @ApiProperty({ example: true, description: 'Whether the job position is active', default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
