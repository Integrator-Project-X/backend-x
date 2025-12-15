import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from './auth-user.dto';

export class LoginResponseDto {
    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJhY2Nlc3NJZCI6MjIsInJvbGVOYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFjbWUuY29tIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDA5MDB9.xxx',
    })
    accessToken!: string;

    @ApiProperty({ type: AuthUserDto })
    user!: AuthUserDto;
}
