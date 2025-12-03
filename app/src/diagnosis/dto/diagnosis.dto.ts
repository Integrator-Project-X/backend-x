import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class DiagnosisDto {
    @ApiProperty({
        example: 1,
        description: 'Diagnosis ID associated with the diagnosis',
    })
    @IsInt()
    @Min(1)
    id_diagnosis: number;

    @ApiProperty({
        example: 2,
        description: 'Personal ID associated with the diagnosis',
    })
    @IsInt()
    @Min(1)
    id_personal: number;

    @ApiProperty({
        example: 'Example diagnosis description',
        description: 'Description of the diagnosis',
    })
    @IsBoolean()
    description: string;

    @ApiProperty({
        example: true,
        description: 'Indicates if the diagnosis is active',
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}