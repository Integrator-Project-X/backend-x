import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsBoolean, IsOptional, IsString } from 'class-validator';

export class DiagnosisDto {
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
    @IsString()
    description: string;

    @ApiProperty({ example: true, required: false, default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}