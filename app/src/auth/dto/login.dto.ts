import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'alfred@vetconnect.com', maxLength: 150 })
    @IsEmail()
    @MaxLength(150)
    email!: string;

    @ApiProperty({ example: 'Str0ngP@ssw0rd!', minLength: 8, maxLength: 128 })
    @IsString()
    @MinLength(7)
    @MaxLength(128)
    password!: string;
}