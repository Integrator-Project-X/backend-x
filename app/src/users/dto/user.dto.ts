import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Length } from 'class-validator';

export class UserDto {
    @ApiProperty({
        example: 'Viva petro',
        description: 'petrista',
    })
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @ApiProperty({
        example: 30,
        description: 'años de vivido',
        required: false,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    age?: number;

    @ApiProperty({
        example: 'Calle 123 #45-67',
        description: 'Dirección de residencia',
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        example: '+57 3001234567',
        description: 'Número de teléfono',
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(7, 20)
    phone_number?: string;

    @ApiProperty({
        example: '123456789',
        description: 'Documento de identidad',
    })
    @IsString()
    @IsNotEmpty()
    identification_number: string;

    @ApiProperty({
        example: 1,
        description: 'ID de genero',
    })
    @IsInt()
    @Min(1)
    id_gender: number;
}
