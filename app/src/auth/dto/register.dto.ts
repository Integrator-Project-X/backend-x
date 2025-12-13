import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';

export class RegisterDto extends UserDto {
    @ApiProperty({ example: 'alfred@example.com', maxLength: 150 })
    @IsEmail()
    @MaxLength(150)
    email!: string;

    @ApiProperty({ example: 'Password123', minLength: 8, maxLength: 128 })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password!: string;
}