import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class JobPositionDto {

    @ApiProperty({ example: 'Groomer', description: 'Name of the job position' })
    @IsString()
    @IsNotEmpty()
    job_position_name: string;

    @ApiProperty({ example: true, description: 'Whether the job position is active', default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
