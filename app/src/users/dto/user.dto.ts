import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Length } from 'class-validator';

export class UserDto {
    @ApiProperty({ example: 'Alfred Wayne', })
    @IsString()
    full_name: string;

    @ApiProperty({ example: 30, required: false })
    @IsInt()
    @Min(0)
    @IsOptional()
    age?: number;

    @ApiProperty({ example: 'Calle 123 #45-67', description: 'Resident Address' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ example: '3001234567', description: 'Tel Number', required: false })
    @IsString()
    @IsOptional()
    @Length(7, 20)
    phone_number?: string;

    @ApiProperty({ example: '123456789', description: 'Identification Document' })
    @IsString()
    @IsOptional()
    identification_number?: string;

    @ApiProperty({ example: 1, description: 'Gender ID' })
    @IsInt()
    @Min(1)
    @IsOptional()
    id_gender?: number;
}
