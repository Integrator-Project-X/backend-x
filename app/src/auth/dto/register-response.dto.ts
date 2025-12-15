import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class RegisterResponseDto {
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @ApiProperty({ example: 'User registered successfully' })
    message: string;
}