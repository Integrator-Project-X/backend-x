import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AnimalDto {

    @ApiProperty({ example: 'Confirmed', description: 'Name of the appointment status' })
    @IsString()
    @IsNotEmpty()
    animal_name: string;

    @ApiProperty({ example: true, description: 'Whether the status is active', default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
