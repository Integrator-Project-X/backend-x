import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class PersonalDto {
    @ApiProperty({
        example: 1,
        description: 'User ID asociado al miembro del personal',
    })
    @IsInt()
    @Min(1)
    id_user: number;

    @ApiProperty({
        example: 2,
        description: 'JobPosition ID (cargo del miembro del personal)',
    })
    @IsInt()
    @Min(1)
    id_job_position: number;

    @ApiProperty({
        example: true,
        description: 'Indica si el personal está activo',
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}