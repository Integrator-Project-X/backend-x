import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsBoolean,
    IsOptional,
    Length,
} from 'class-validator';

export class ClinicDto {
    @ApiProperty({
        example: 'Happy Pets Veterinary Center',
        description: 'Name of the clinic',
    })
    @IsString()
    @IsNotEmpty()
    clinic_name: string;

    @ApiProperty({
        example: '123 Main St, Barranquilla, Colombia',
        description: 'Full address of the clinic',
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        example: '3001234567',
        description: 'Contact phone number of the clinic',
    })
    @IsString()
    @Length(7, 15)
    phone_number: string;

    @ApiProperty({
        example: '900456789',
        description: 'Identification number (NIT or equivalent)',
    })
    @IsString()
    @IsNotEmpty()
    identification_number: string;

    @ApiProperty({
        example: true,
        description: 'Whether the clinic is active',
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
