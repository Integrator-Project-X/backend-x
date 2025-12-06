import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RaceDto {

    @ApiProperty({ example: 'Siberian', description: 'Name of the race' })
    @IsString()
    @IsNotEmpty()
    race_name: string;

    @ApiProperty({ example: true, description: 'Whether the race is active', default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
