// dto structure for gender
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GenderDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: true, description: 'Whether the gender is active', default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
