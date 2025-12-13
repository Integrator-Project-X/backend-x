import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'alfred@example.com', maxLength: 150 })
    @IsEmail()
    @MaxLength(150)
    email!: string;

    @ApiProperty({ example: 'Password123', minLength: 8, maxLength: 128 })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password!: string;

    @ApiProperty({ example: 1, description: 'User ID' })
    @IsInt()
    @Min(1)
    id_user!: number;

    @ApiProperty({ example: 1, description: 'Role ID' })
    @IsInt()
    @Min(1)
    id_role!: number;
}