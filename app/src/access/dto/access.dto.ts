import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class AccessDto {
    @ApiProperty({ example: 'alfred@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Password123' })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 1, description: 'User ID' })
    @IsInt()
    @Min(1)
    id_user: number;

    @ApiProperty({ example: 1, description: 'Role ID' })
    @IsInt()
    @Min(1)
    id_role: number;

    @ApiProperty({
        example: true,
        description: 'Indicates if the access is active',
        required: false,
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}