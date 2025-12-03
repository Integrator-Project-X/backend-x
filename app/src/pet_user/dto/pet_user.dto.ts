import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class PetUserDto {
    @ApiProperty({
        example: 1,
        description: 'ID del usuario (FK a users)',
    })
    @IsInt()
    @Min(1)
    id_user: number;

    @ApiProperty({
        example: 1,
        description: 'ID de la mascota (FK a pets)',
    })
    @IsInt()
    @Min(1)
    id_pet: number;

    @ApiProperty({
        example: true,
        description: 'Si la relación está activa',
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
